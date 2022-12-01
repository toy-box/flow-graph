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
import { FlowMetaNode } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'

export * from './addNode'
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
const decidePanelSchema = {
  type: 'object',
  properties: {
    rules: {
      type: 'array',
      title: '结果顺序',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        layout: 'vertical',
      },
      // maxItems: 3,
      'x-component': 'ArrayTabs',
      'x-component-props': {
        tabPosition: 'left',
      },
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              layout: 'virtical',
            },
            title: '标签',
            required: true,
            'x-component': 'Input',
          },
          outcomeApi: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              layout: 'virtical',
            },
            title: '结果 API 名称',
            required: true,
            'x-component': 'Input',
          },
          logic: {
            type: 'string',
            title: 'Condition Requirements to Execute Outcome',
            required: true,
            enum: [
              {
                label: 'All Conditions Are Met (AND)',
                value: '$and',
              },
              {
                label: 'Any Condition Is Met (OR)',
                value: '$or',
              },
              {
                label: 'Custom Condition Logic Is Met',
                value: '$custom',
              },
            ],
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              layout: 'virtical',
            },
            'x-component-props': {},
            'x-component': 'Select',
          },
          conditions: {
            type: 'array',
            required: true,
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems',
            items: {
              type: 'object',
              'x-component': 'ArrayItems.Item',
              properties: {
                conditionObj: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    layout: 'virtical',
                  },
                  'x-component': 'FormGrid',
                  properties: {
                    resource: {
                      type: 'string',
                      title: 'resource',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: 'Search Resources',
                      },
                    },
                    operator: {
                      type: 'string',
                      title: 'operator',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: 'operator',
                      },
                    },
                    value: {
                      type: 'string',
                      title: 'value',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: 'Enter value or search resources...',
                      },
                    },
                  },
                },
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Contact',
                'x-component': 'ArrayItems.Addition',
              },
            },
          },
        },
      },
    },
  },
}

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
    rules: {
      type: 'object',
      properties: {
        titleCollection: {
          type: 'void',
          'x-decorator': 'FormItem',
          'x-component': () => {
            return <div>Select Collection Variable</div>
          },
        },
        collectionVariable: {
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
        direction: {
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
    },
  },
}
const assignRender = () => {
  return FormDialog({ title: `AssignMent Node Properites` }, () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <SchemaField schema={assignNodeSchema} />
      </FormLayout>
    )
  })
}

const decideRender = () => {
  return FormDialog(
    { title: `Decision Node Properites`, width: '90vw' },
    () => {
      // const decideForm = createForm()
      // decideForm.setInitialValues({
      // })
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          {/* <Form form={decideForm}> */}
          <SchemaField schema={assignNodeSchema} />
          <div style={{ fontSize: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>结果</span>{' '}
            对于流可以使用的每个路径，创建结果。对于每个结果，指定必须满足的条件，以便流使用该路径。
          </div>
          <SchemaField schema={decidePanelSchema} />
          {/* </Form> */}
        </FormLayout>
      )
    }
  )
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

export const assignOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = assignRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.name ?? node.title,
            description: node.description,
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        at
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

export const decideOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = decideRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.name ?? node.title,
            description: node.description,
            rules: node.rules ?? [
              {
                logic: '$and',
                conditions: [{}],
              },
              {
                logic: '$and',
                conditions: [
                  {
                    resource: 'default',
                    operator: 'default',
                    value: 'default',
                  },
                ],
                name: 'default',
                outcomeApi: 'default',
              },
            ],
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        at
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

export const loopOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = loopRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.name ?? node.title,
            description: node.description,
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      console.log('payload.values - node', payload.values, node)
      setTimeout(() => {
        at
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

export const onPanelEdit = (
  node: INodeTemplate<NodeMake>,
  at: string,
  additionInfo?: any
) => {
  const chooseDialog = () => {
    switch (node.title) {
      case 'AssignMent':
        return assignOnEdit(node, at, additionInfo)
      case 'Decision':
        return decideOnEdit(node, at, additionInfo)
      case 'Loop':
        return loopOnEdit(node, at, additionInfo)
      default:
        return assignOnEdit(node, at, additionInfo)
    }
  }
  chooseDialog()
}
