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
    Divider,
  },
})

const loopPanelSchema = {
  type: 'object',
  properties: {
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
          'x-component': 'Input',
        },
        id: {
          type: 'string',
          title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
          required: true,
          'x-validator': [
            {
              triggerType: 'onBlur',
              required: true,
              message: (
                <TextWidget>flowDesigner.flow.form.validator.value</TextWidget>
              ),
            },
          ],
          'x-decorator': 'FormItem',
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
            gridSpan: 2,
          },
        },
      },
    },
    titleCollection: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': () => {
        return (
          <>
            <Divider />
            <TextWidget token="flowDesigner.flow.form.loop.titleCollection" />
          </>
        )
      },
    },
    collectionReference: {
      type: 'string',
      title: (
        <TextWidget token="flowDesigner.flow.form.loop.collectionReference" />
      ),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    titleDirection: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': () => {
        return (
          <>
            <Divider />
            <TextWidget token="flowDesigner.flow.form.loop.titleDirection" />
          </>
        )
      },
    },
    iterationOrder: {
      type: 'number',
      title: 'Direction',
      enum: [
        {
          label: (
            <TextWidget token="flowDesigner.flow.form.loop.iterationPositive" />
          ),
          value: 1,
        },
        {
          label: (
            <TextWidget token="flowDesigner.flow.form.loop.iterationReverse" />
          ),
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
        return (
          <>
            <Divider />
            <TextWidget token="flowDesigner.flow.form.loop.titleLoop" />
          </>
        )
      },
    },
    loopVariable: {
      type: 'string',
      title: <TextWidget token="flowDesigner.flow.form.loop.loopVariable" />,
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}

const loopRender = () => {
  return FormDialog({ title: `Loop Node Properites`, width: '90vw' }, () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <SchemaField schema={loopPanelSchema} />
      </FormLayout>
    )
  })
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
