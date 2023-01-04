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
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 2,
      },
      properties: {
        rules: {
          type: 'array',
          title: (
            <TextWidget token="flowDesigner.flow.form.comm.label"></TextWidget>
          ),
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            layout: 'vertical',
          },
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
              id: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  layout: 'virtical',
                },
                title: '结果 API 名称',
                required: true,
                'x-component': 'Input',
              },
              criteria: {
                type: 'object',
                properties: {
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
                        // conditionObj: {
                        //   type: 'void',
                        //   'x-decorator': 'FormItem',
                        //   'x-decorator-props': {
                        //     layout: 'virtical',
                        //   },
                        // 'x-component': 'FormGrid',
                        // properties: {
                        operation: {
                          type: 'string',
                          title: 'resource',
                          required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: 'Search Resources',
                          },
                        },
                        type: {
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
                        remove: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.Remove',
                        },
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
        },
      },
    },
  },
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

export const decideOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = decideRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            rules: node.rules ?? [
              {
                criteria: {
                  logic: '$and',
                  conditions: [{}],
                },
              },
              // {
              //   criteria: {
              //     logic: '$and',
              //     conditions: [
              //       {
              //         operation: 'default',
              //         type: 'equals',
              //         value: 'default',
              //       },
              //     ]
              //   },
              //   name: 'default',
              //   id: 'default',
              // },
            ],
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
