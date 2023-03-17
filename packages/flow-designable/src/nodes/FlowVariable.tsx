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
import { AssignmentDesc } from '@toy-box/flow-designable'

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
    AssignmentDesc,
  },
})

export const commSchema = {
  grid: {
    type: 'void',
    'x-component': 'FormGrid',
    'x-component-props': {
      maxColumns: 2,
    },
    properties: {
      name: {
        type: 'string',
        title: (
          <TextWidget token="flowDesigner.flow.form.comm.label"></TextWidget>
        ),
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          layout: 'vertical',
          colon: false,
        },
        'x-component': 'Input',
        'x-validator': [
          {
            triggerType: 'onBlur',
            required: false,
            message: (
              <TextWidget>flowDesigner.flow.form.validator.required</TextWidget>
            ),
          },
        ],
      },
      id: {
        type: 'string',
        title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
        required: true,
        'x-disabled': false,
        'x-validator': [
          {
            triggerType: 'onBlur',
            required: false,
            message: (
              <TextWidget>flowDesigner.flow.form.validator.value</TextWidget>
            ),
          },
        ],
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          layout: 'vertical',
          colon: false,
        },
        'x-component': 'Input',
      },
      description: {
        type: 'string',
        title: (
          <TextWidget token="flowDesigner.flow.form.comm.description"></TextWidget>
        ),
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-decorator-props': {
          layout: 'vertical',
          colon: false,
          gridSpan: 2,
          feedbackLayout: 'terse',
        },
      },
      desc: {
        type: 'string',
        title: '',
        'x-decorator': 'FormItem',
        'x-component': 'descTipHtml',
        'x-decorator-props': {
          gridSpan: 2,
          feedbackLayout: 'terse',
        },
      },
    },
  },
}

export const variableOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const isEdit = !node.make
  const shortcutJson =
    node?.shortcutJson ??
    node.metaFlow.shortcutData.find((shortcut) => shortcut.id === node.title)
  const variable = node?.variable ?? shortcutJson.variable
  const title = !isEdit ? (
    <TextWidget>flowDesigner.flow.form.variable.addTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.flow.form.variable.editTitle</TextWidget>
  )
  commSchema.grid.properties.id['x-disabled'] = isEdit
  const schema = convertMetaToFormily(variable, commSchema)
  console.log('schema', schema)
  const dialog = FormDialog(
    {
      title: title,
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
