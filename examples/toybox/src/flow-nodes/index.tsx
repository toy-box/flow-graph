import React from 'react'
import { FormDialog, FormItem, FormLayout, Input } from '@formily/antd'
import { createSchemaField } from '@formily/react'
import { FlowMetaNode } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake, FlowNodeType } from '@toy-box/flow-node'

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
const assignRender = (node: FlowMetaNode | INodeTemplate<NodeMake>) => {
  return (
    <FormLayout labelCol={6} wrapperCol={10}>
      <SchemaField schema={assignNodeSchema} />
    </FormLayout>
  )
}

const decideRender = (node: FlowMetaNode | INodeTemplate<NodeMake>) => {
  return (
    <FormLayout labelCol={6} wrapperCol={10}>
      <SchemaField schema={assignNodeSchema} />
    </FormLayout>
  )
}

const loopRender = (node: FlowMetaNode | INodeTemplate<NodeMake>) => {
  return (
    <FormLayout labelCol={6} wrapperCol={10}>
      <SchemaField schema={assignNodeSchema} />
    </FormLayout>
  )
}

export const assignOnEdit = (node: FlowMetaNode) => {
  const dialog = FormDialog('Assign Node Properites', () => {
    return assignRender(node)
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

export const decideOnEdit = (node: FlowMetaNode) => {
  const dialog = FormDialog('Decision Node Properites', () => {
    return decideRender(node)
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

export const loopOnEdit = (node: FlowMetaNode) => {
  const dialog = FormDialog('Loop Node Properites', () => {
    return loopRender(node)
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

export const onPanelEdit = (node: INodeTemplate<NodeMake>, at: string) => {
  const dialog = FormDialog(`${node.title} Node Properites`, () => {
    const chooseRender = () => {
      switch (node.title) {
        case 'AssignMent':
          return assignRender(node)
        case 'Decison':
          return decideRender(node)
        case 'Loop':
          return loopRender(node)
        default:
          return assignRender(node)
      }
    }
    return chooseRender()
  })
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.title,
            description: node.description,
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        node.make(at, payload.values)
        // node.update(payload.values)
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
