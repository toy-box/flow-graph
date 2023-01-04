import React from 'react'
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
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { TextWidget } from '../widgets'

const SchemaField = createSchemaField({
  components: {
    ArrayTabs,
    ArrayItems,
    FormItem,
    FormGrid,
    Input,
    Select,
    Radio,
  },
})

const loopPanelSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    description: {
      type: 'string',
      title: '简述',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    titleCollection: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': () => {
        return <div>Select Collection Variable</div>
      },
    },
    collectionReference: {
      type: 'string',
      title: 'Collection Variable',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    titleDirection: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': () => {
        return <div>Specify Direction for Iterating Over Collection</div>
      },
    },
    iterationOrder: {
      type: 'number',
      title: 'Direction',
      enum: [
        {
          label: 'First item to last item',
          value: 1,
        },
        {
          label: 'Last item to first item',
          value: 2,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
    },
    titleLoop: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': () => {
        return <div>Select Loop Variable</div>
      },
    },
    loopVariable: {
      type: 'string',
      title: 'Loop Variable',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}

export const loopOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = loopRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            collectionReference: node.collectionReference,
            iterationOrder: node.iterationOrder,
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        node.make
          ? node.make(at, { ...payload.values, ...additionInfo })
          : node.update(payload.values)
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
