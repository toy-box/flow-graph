import React from 'react'
import { Divider } from 'antd'
import {
  FormDialog,
  FormItem,
  FormLayout,
  Input,
  Select,
  FormGrid,
  ArrayItems,
  FormTab,
  Space,
  ArrayTable,
  Password,
  Radio,
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import * as ICONS from '@ant-design/icons'
import { FlowMetaNode, FlowMetaType, FreeFlow } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { useLocale } from '../hooks'
import { ResourceSelect, OperationSelect } from '../components/formily'
import { TextWidget, takeMessage } from '../widgets'

import './flowNodes.less'

const AssignmentDesc = () => {
  return (
    <div>
      <Divider className="margin-0" />
      {/* <div className="assignment-content">
        <div className="assignment-title connectDialog-title">
          <TextWidget>flowDesigner.flow.form.assignment.setVariable</TextWidget>
        </div>
        <div className="assignment-desc">
          <TextWidget>flowDesigner.flow.form.assignment.tip</TextWidget>
        </div>
      </div> */}
    </div>
  )
}

const formTab = FormTab.createFormTab()

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    ArrayItems,
    Input,
    Select,
    FormTab,
    Space,
    ArrayTable,
    Password,
    Radio,
    AssignmentDesc,
    ResourceSelect,
    OperationSelect,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name])
    },
  },
})

const httpCallsRender = (isNew: boolean, metaFlow: FreeFlow) => {
  const httpCallsSchema = {
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
                  <TextWidget>
                    flowDesigner.flow.form.validator.required
                  </TextWidget>
                ),
              },
            ],
          },
          id: {
            type: 'string',
            title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
            required: true,
            'x-disabled': !isNew,
            'x-validator': [
              {
                triggerType: 'onBlur',
                required: false,
                message: (
                  <TextWidget>
                    flowDesigner.flow.form.validator.value
                  </TextWidget>
                ),
              },
              //   {
              //     triggerType: 'onBlur',
              //     validator: (value: string) => {
              //       if (!value) return null
              //       const message = new RepeatErrorMessage(
              //         flowGraph,
              //         value,
              //         assignmentData,
              //         apiReg
              //       )
              //       return (
              //         message.errorMessage && (
              //           <TextWidget>{message.errorMessage}</TextWidget>
              //         )
              //       )
              //     },
              //   },
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
            'x-component': 'AssignmentDesc',
            'x-decorator-props': {
              gridSpan: 2,
              feedbackLayout: 'terse',
            },
          },
          callArguments: {
            type: 'object',
            properties: {
              grid: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  feedbackLayout: 'terse',
                },
                'x-component': 'FormGrid',
                'x-component-props': {
                  maxColumns: 6,
                },
                properties: {
                  method: {
                    type: 'string',
                    title: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.methodTitle"></TextWidget>
                    ),
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      layout: 'vertical',
                      colon: false,
                      feedbackLayout: 'terse',
                    },
                    'x-component': 'Select',
                    'x-component-props': {
                      style: {
                        // width: 100,
                      },
                    },
                    enum: [
                      {
                        label: 'GET',
                        value: 'GET',
                      },
                      {
                        label: 'POST',
                        value: 'POST',
                      },
                      {
                        label: 'PUT',
                        value: 'PUT',
                      },
                      {
                        label: 'DELETE',
                        value: 'DELETE',
                      },
                      {
                        label: 'HEAD',
                        value: 'HEAD',
                      },
                      {
                        label: 'OPTIONS',
                        value: 'OPTIONS',
                      },
                      {
                        label: 'PATCH',
                        value: 'PATCH',
                      },
                      {
                        label: 'CONNECT',
                        value: 'CONNECT',
                      },
                      {
                        label: 'TRACE',
                        value: 'TRACE',
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                    title: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.urlTitle"></TextWidget>
                    ),
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      layout: 'vertical',
                      colon: false,
                      gridSpan: 5,
                      feedbackLayout: 'terse',
                    },
                    'x-component': 'Input',
                    'x-validator': [
                      {
                        triggerType: 'onBlur',
                        required: false,
                        message: (
                          <TextWidget>
                            flowDesigner.flow.form.validator.required
                          </TextWidget>
                        ),
                      },
                    ],
                  },
                },
              },
              httpFormTab: {
                type: 'void',
                'x-component': 'FormTab',
                'x-component-props': {
                  formTab: '{{formTab}}',
                },
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                properties: {
                  tab1: {
                    type: 'void',
                    'x-component': 'FormTab.TabPane',
                    'x-component-props': {
                      tab: 'Params',
                    },
                    properties: {
                      parameters: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayTable',
                        'x-component-props': {
                          pagination: { pageSize: 10 },
                          scroll: { x: '100%' },
                        },
                        items: {
                          type: 'object',
                          properties: {
                            column1: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 50,
                                title: 'Sort',
                                align: 'center',
                              },
                              properties: {
                                sort: {
                                  type: 'void',
                                  'x-component': 'ArrayTable.SortHandle',
                                },
                              },
                            },
                            column2: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 100,
                                title: 'TYPE',
                                align: 'center',
                              },
                              properties: {
                                type: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Select',
                                  required: true,
                                  enum: [
                                    {
                                      label: 'Query',
                                      value: 'Query',
                                    },
                                    {
                                      label: 'Path',
                                      value: 'Path',
                                    },
                                  ],
                                },
                              },
                            },
                            column3: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': { width: 200, title: 'KEY' },
                              required: true,
                              properties: {
                                key: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column4: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 200,
                                title: 'VALUE',
                              },
                              required: true,
                              properties: {
                                value: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column5: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: 'Operations',
                                dataIndex: 'operations',
                                width: 200,
                                fixed: 'right',
                              },
                              properties: {
                                item: {
                                  type: 'void',
                                  'x-component': 'FormItem',
                                  properties: {
                                    remove: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Remove',
                                    },
                                    moveDown: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveDown',
                                    },
                                    moveUp: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveUp',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        properties: {
                          add: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                            title: '添加条目',
                          },
                        },
                      },
                    },
                  },
                  tab2: {
                    type: 'void',
                    'x-component': 'FormTab.TabPane',
                    'x-component-props': {
                      tab: 'Authorization',
                    },
                    properties: {
                      authorization: {
                        type: 'object',
                        'x-decorator': 'FormItem',
                        'x-component': 'FormGrid',
                        'x-component-props': {
                          maxColumns: 4,
                        },
                        properties: {
                          type: {
                            type: 'string',
                            title: 'Type',
                            'x-decorator': 'FormItem',
                            'x-decorator-props': {
                              layout: 'vertical',
                              colon: false,
                              gridSpan: 1,
                            },
                            'x-component': 'Select',
                            'x-component-props': {
                              gridSpan: 1,
                            },
                            required: true,
                            enum: [
                              {
                                label: 'No Auth',
                                value: 'No Auth',
                              },
                              {
                                label: 'Bearer Token',
                                value: 'Bearer Token',
                              },
                              {
                                label: 'Basic Auth',
                                value: 'Basic Auth',
                              },
                            ],
                          },
                          object: {
                            type: 'object',
                            'x-decorator': 'FormItem',
                            'x-decorator-props': {
                              gridSpan: 3,
                            },
                            'x-component': 'FormGrid',
                            'x-component-props': {
                              maxColumns: 1,
                            },
                            properties: {
                              token: {
                                type: 'string',
                                title: 'Token',
                                'x-decorator': 'FormItem',
                                'x-decorator-props': {
                                  layout: 'vertical',
                                  colon: false,
                                },
                                'x-component': 'Input',
                                required: true,
                              },
                              username: {
                                type: 'string',
                                title: 'Username',
                                'x-decorator': 'FormItem',
                                'x-decorator-props': {
                                  layout: 'vertical',
                                  colon: false,
                                },
                                'x-component': 'Input',
                                required: true,
                              },
                              password: {
                                type: 'string',
                                title: 'Password',
                                'x-decorator': 'FormItem',
                                'x-decorator-props': {
                                  layout: 'vertical',
                                  colon: false,
                                },
                                'x-component': 'Password',
                                required: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  tab3: {
                    type: 'void',
                    'x-component': 'FormTab.TabPane',
                    'x-component-props': {
                      tab: 'Headers',
                    },
                    properties: {
                      headers: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayTable',
                        'x-component-props': {
                          pagination: { pageSize: 10 },
                          scroll: { x: '100%' },
                        },
                        items: {
                          type: 'object',
                          properties: {
                            column1: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 50,
                                title: 'Sort',
                                align: 'center',
                              },
                              properties: {
                                sort: {
                                  type: 'void',
                                  'x-component': 'ArrayTable.SortHandle',
                                },
                              },
                            },
                            column3: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': { width: 200, title: 'KEY' },
                              required: true,
                              properties: {
                                key: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column4: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 200,
                                title: 'VALUE',
                              },
                              required: true,
                              properties: {
                                value: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column5: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: 'Operations',
                                dataIndex: 'operations',
                                width: 200,
                                fixed: 'right',
                              },
                              properties: {
                                item: {
                                  type: 'void',
                                  'x-component': 'FormItem',
                                  properties: {
                                    remove: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Remove',
                                    },
                                    moveDown: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveDown',
                                    },
                                    moveUp: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveUp',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        properties: {
                          add: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                            title: '添加条目',
                          },
                        },
                      },
                    },
                  },
                  tab4: {
                    type: 'void',
                    'x-component': 'FormTab.TabPane',
                    'x-component-props': {
                      tab: 'Body',
                    },
                    properties: {
                      contentType: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        required: true,
                        'x-component': 'Radio.Group',
                        enum: [
                          {
                            label: 'none',
                            value: 'none',
                          },
                          {
                            label: 'form-data',
                            value: 'form-data',
                          },
                          {
                            label: 'x-www-form-urlencoded',
                            value: 'x-www-form-urlencoded',
                          },
                          {
                            label: 'raw',
                            value: 'raw',
                          },
                          {
                            label: 'binary',
                            value: 'binary',
                          },
                          {
                            label: 'GraphQL',
                            value: 'GraphQL',
                          },
                        ],
                      },
                      body: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayTable',
                        'x-component-props': {
                          pagination: { pageSize: 10 },
                          scroll: { x: '100%' },
                        },
                        items: {
                          type: 'object',
                          properties: {
                            column1: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 50,
                                title: 'Sort',
                                align: 'center',
                              },
                              properties: {
                                sort: {
                                  type: 'void',
                                  'x-component': 'ArrayTable.SortHandle',
                                },
                              },
                            },
                            column3: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': { width: 200, title: 'KEY' },
                              required: true,
                              properties: {
                                key: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column4: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 200,
                                title: 'VALUE',
                              },
                              required: true,
                              properties: {
                                value: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column5: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: 'Operations',
                                dataIndex: 'operations',
                                width: 200,
                                fixed: 'right',
                              },
                              properties: {
                                item: {
                                  type: 'void',
                                  'x-component': 'FormItem',
                                  properties: {
                                    remove: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Remove',
                                    },
                                    moveDown: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveDown',
                                    },
                                    moveUp: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveUp',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        properties: {
                          add: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                            title: '添加条目',
                          },
                        },
                      },
                    },
                  },
                  tab5: {
                    type: 'void',
                    'x-component': 'FormTab.TabPane',
                    'x-component-props': {
                      tab: 'Cookies',
                    },
                    properties: {
                      cookies: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayTable',
                        'x-component-props': {
                          pagination: { pageSize: 10 },
                          scroll: { x: '100%' },
                        },
                        items: {
                          type: 'object',
                          properties: {
                            column1: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 50,
                                title: 'Sort',
                                align: 'center',
                              },
                              properties: {
                                sort: {
                                  type: 'void',
                                  'x-component': 'ArrayTable.SortHandle',
                                },
                              },
                            },
                            column3: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 200,
                                title: 'NAME',
                              },
                              required: true,
                              properties: {
                                key: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column4: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 200,
                                title: 'DOMAIN',
                              },
                              required: true,
                              properties: {
                                domain: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input',
                                },
                              },
                            },
                            column6: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                width: 200,
                                title: 'VALUE',
                              },
                              required: true,
                              properties: {
                                value: {
                                  type: 'string',
                                  'x-decorator': 'FormItem',
                                  'x-component': 'Input.TextArea',
                                },
                              },
                            },
                            column5: {
                              type: 'void',
                              'x-component': 'ArrayTable.Column',
                              'x-component-props': {
                                title: 'Operations',
                                dataIndex: 'operations',
                                width: 200,
                                fixed: 'right',
                              },
                              properties: {
                                item: {
                                  type: 'void',
                                  'x-component': 'FormItem',
                                  properties: {
                                    remove: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Remove',
                                    },
                                    moveDown: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveDown',
                                    },
                                    moveUp: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.MoveUp',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        properties: {
                          add: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                            title: '添加条目',
                          },
                        },
                      },
                    },
                  },
                },
              },
              result: {
                type: 'string',
                title: 'result',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  layout: 'vertical',
                  colon: false,
                },
                'x-component': 'Input',
              },
              pathParameters: {
                type: 'string',
              },
              queryParameters: {
                type: 'object',
              },
              cookies: {
                type: 'object',
              },
              headers: {
                type: 'object',
              },
              form: {
                type: 'object',
              },
              body: {
                anyOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'object' },
                ],
              },
              authorization: {
                type: 'object',
                default: {},
                title: 'The Authorizetion Schema',
                properties: {
                  type: {
                    type: 'string',
                  },
                  username: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                  token: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  }
  const getToken = isNew
    ? 'flowDesigner.flow.form.httpCalls.addTitle'
    : 'flowDesigner.flow.form.httpCalls.editTitle'
  return FormDialog(
    {
      title: <TextWidget>{getToken}</TextWidget>,
      width: '90vw',
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={httpCallsSchema} scope={{ formTab }} />
        </FormLayout>
      )
    }
  )
}

export const httpCallsOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = httpCallsRender(node.make, node.metaFlow)
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            assignmentItems: node.assignmentItems ?? [
              { operation: undefined, type: undefined, value: undefined },
            ],
            id: node.id,
          },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      console.log('payload', payload)
      // setTimeout(() => {
      //   node.make
      //     ? node.make(at, { ...payload.values, ...additionInfo })
      //     : node.update(payload.values)
      //   next(payload)
      // }, 500)
    })
    .forCancel((payload, next) => {
      setTimeout(() => {
        next(payload)
      }, 500)
    })
    .open()
}
