import React from 'react'
import { Divider } from 'antd'
import {
  FormDialog,
  FormItem,
  FormLayout,
  Input,
  ArrayTabs,
  ArrayItems,
  Select,
  FormGrid,
  Radio,
  DatePicker,
  NumberPicker,
  Checkbox,
  ArrayTable,
  Form,
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import * as ICONS from '@ant-design/icons'
import { createForm } from '@formily/core'
import { observable } from '@formily/reactive'
import { FlowMetaNode, FlowMetaType, FreeFlow } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { ResourceSelect, OperationSelect } from '../components/formily'
import { TextWidget, useLocale } from '@toy-box/studio-base'
import {
  convertHttpFormilyToJson,
  convertMetaToFormily,
  keyValueToObjArray,
  objArrayToKeyValue,
} from '@toy-box/action-template'
import { MetaValueType } from '@toy-box/meta-schema'

import { BranchArrays } from '../components/formily'

const descTipHtml = () => {
  return (
    <div className="branch-arrays-tip">
      <p className="name">
        <TextWidget>flowDesigner.flow.form.decision.tipTitle</TextWidget>
      </p>
      <p className="tip">
        <TextWidget>flowDesigner.flow.form.decision.tip</TextWidget>
      </p>
    </div>
  )
}

const SchemaField = createSchemaField({
  components: {
    ArrayTabs,
    ArrayItems,
    FormItem,
    NumberPicker,
    FormGrid,
    Input,
    Select,
    Radio,
    descTipHtml,
    BranchArrays,
    ResourceSelect,
    OperationSelect,
    DatePicker,
    Checkbox,
    ArrayTable,
  },
})

export const variableOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const shortcutJson =
    node?.shortcutJson ??
    node.metaFlow.shortcutData.find((shortcut) => shortcut.id === node.title)
  const variable = node?.variable ?? shortcutJson.variable
  const schema = convertMetaToFormily(variable)
  console.log('schema', schema)
  const dialog = FormDialog(
    {
      title: 'test',
      width: '90vw',
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={schema} />
        </FormLayout>
      )
    }
  )
  dialog
    .forOpen((payload, next) => {
      node?.shortcutJson &&
        variable
          .filter(({ type }) => type === MetaValueType.OBJECT)
          .map(({ key }) => {
            shortcutJson.variable[key] = keyValueToObjArray(
              shortcutJson.variable[key]
            )
          })
      setTimeout(() => {
        next({
          initialValues: node?.shortcutJson ? shortcutJson.variable : {},
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        variable
          .filter(({ type }) => type === MetaValueType.OBJECT)
          .map(({ key }) => {
            payload.values[key] = objArrayToKeyValue(payload.values[key])
          })
        const paramData = {
          variable,
          shortcutJson: {
            ...shortcutJson,
            variable: payload.values,
          },
        }
        console.log('paramData', paramData)
        node.make
          ? node.make(at, { ...paramData, ...additionInfo })
          : node.update(paramData)
        next(payload)
      }, 500)
    })
    .forCancel((payload, next) => {
      setTimeout(() => {
        next(payload)
      }, 500)
    })
    .open()
}
