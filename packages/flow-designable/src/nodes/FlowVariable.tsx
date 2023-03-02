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
    FormGrid,
    Input,
    Select,
    Radio,
    descTipHtml,
    BranchArrays,
    ResourceSelect,
    OperationSelect,
    DatePicker,
  },
})

export const variableOnEdit = (schema: any) => {
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
      setTimeout(() => {
        next()
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        // node.make
        //   ? node.make(at, { ...payload.values, ...additionInfo })
        //   : node.update(payload.values)
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
