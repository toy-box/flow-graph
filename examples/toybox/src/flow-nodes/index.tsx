import React from 'react'
import { FormDialog, FormItem, FormLayout, Input } from '@formily/antd'
import { createSchemaField } from '@formily/react'
import { FlowMetaNode } from '@toy-box/autoflow-core'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
  },
})

const assignNodeSchema = {
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
  },
}

export const assignOnEdit = (node: FlowMetaNode) => {
  const dialog = FormDialog('Assign Node Properites', () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <SchemaField schema={assignNodeSchema} />
      </FormLayout>
    )
  })
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.name,
            description: node.description,
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        node.update(payload.values)
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
