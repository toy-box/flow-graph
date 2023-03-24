import React, { FC, useCallback } from 'react'
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
  Submit,
} from '@formily/antd'
import { Button } from 'antd'
import { createSchemaField, FormProvider, observer } from '@formily/react'
import * as ICONS from '@ant-design/icons'
import {
  FlowMetaNode,
  FlowMetaType,
  FreeFlow,
  FlowMetaUpdate,
  IContentTypeEnum,
  FlowMetaParam,
} from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { ResourceSelect, OperationSelect } from '../components/formily'
import { TextWidget, useLocale } from '@toy-box/studio-base'
import { clone } from '@designable/shared'
import {
  convertHttpFormilyToJson,
  converHttpJsonToFormily,
} from '@toy-box/action-template'
import {
  createForm,
  onFieldChange,
  onFieldInitialValueChange,
  onFieldValueChange,
} from '@formily/core'

import './flowNodes.less'
import { AutoFlow } from '../interface'

export const AssignmentDesc = () => {
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

export const httpCallsSchema = {
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
          // 'x-disabled': !isNew,
          'x-validator': [
            {
              triggerType: 'onBlur',
              required: false,
              message: (
                <TextWidget>flowDesigner.flow.form.validator.value</TextWidget>
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
                  default: 'GET',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    layout: 'vertical',
                    colon: false,
                    feedbackLayout: 'terse',
                  },
                  'x-component': 'Select',
                  enum: [
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumGET"></TextWidget>
                      ),
                      value: 'GET',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumPOST"></TextWidget>
                      ),
                      value: 'POST',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumPUT"></TextWidget>
                      ),
                      value: 'PUT',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumDELETE"></TextWidget>
                      ),
                      value: 'DELETE',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumHEAD"></TextWidget>
                      ),
                      value: 'HEAD',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumOPTIONS"></TextWidget>
                      ),
                      value: 'OPTIONS',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumPATCH"></TextWidget>
                      ),
                      value: 'PATCH',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumCONNECT"></TextWidget>
                      ),
                      value: 'CONNECT',
                    },
                    {
                      label: (
                        <TextWidget token="flowDesigner.flow.form.httpCalls.enumTRACE"></TextWidget>
                      ),
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
                  // 'x-component-props': {
                  //   placeholder: useLocale(
                  //     'flowDesigner.flow.form.httpCalls.placeholderUrl'
                  //   ),
                  // },
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
                    // tab: 'Params',
                    tab: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.params"></TextWidget>
                    ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableSort"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableType"></TextWidget>
                              ),
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
                                    label: (
                                      <TextWidget token="flowDesigner.flow.form.httpCalls.enumQuery"></TextWidget>
                                    ),
                                    value: 'Query',
                                  },
                                  {
                                    label: (
                                      <TextWidget token="flowDesigner.flow.form.httpCalls.enumPath"></TextWidget>
                                    ),
                                    value: 'Path',
                                  },
                                ],
                              },
                            },
                          },
                          column3: {
                            type: 'void',
                            'x-component': 'ArrayTable.Column',
                            'x-component-props': {
                              width: 200,
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableKey"></TextWidget>
                              ),
                            },
                            required: true,
                            properties: {
                              key: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                                'x-reactions': [
                                  {
                                    dependencies: ['.type'],
                                    when: "{{$deps[0] === 'Path'}}",
                                    fulfill: {
                                      schema: {
                                        'x-visible': false,
                                      },
                                    },
                                    otherwise: {
                                      schema: {
                                        'x-visible': true,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                          column4: {
                            type: 'void',
                            'x-component': 'ArrayTable.Column',
                            'x-component-props': {
                              width: 200,
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableValue"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableOperations"></TextWidget>
                              ),
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
                          title: (
                            <TextWidget token="flowDesigner.flow.form.comm.arrayTableAdd"></TextWidget>
                          ),
                        },
                      },
                    },
                  },
                },
                tab2: {
                  type: 'void',
                  'x-component': 'FormTab.TabPane',
                  'x-component-props': {
                    tab: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.authorization"></TextWidget>
                    ),
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
                          default: 'No Auth',
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
                              label: (
                                <TextWidget token="flowDesigner.flow.form.httpCalls.enumNoAuth"></TextWidget>
                              ),
                              value: 'No Auth',
                            },
                            {
                              label: (
                                <TextWidget token="flowDesigner.flow.form.httpCalls.enumBearerToken"></TextWidget>
                              ),
                              value: 'Bearer Token',
                            },
                            {
                              label: (
                                <TextWidget token="flowDesigner.flow.form.httpCalls.enumBasicAuth"></TextWidget>
                              ),
                              value: 'Basic Auth',
                            },
                          ],
                        },
                        object: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-decorator-props': {
                            gridSpan: 3,
                          },
                          'x-component': 'FormGrid',
                          'x-component-props': {
                            maxColumns: 1,
                          },
                          // 'x-reactions': [
                          //   {
                          //     dependencies: ['.type'],
                          //     when: "{{$deps[0] === 'No Auth'}}",
                          //     fulfill: {
                          //       schema: {
                          //         'x-visible': false,
                          //       },
                          //     },
                          //     otherwise: {
                          //       schema: {
                          //         'x-visible': true,
                          //       },
                          //     },
                          //   },
                          // ],
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
                              'x-reactions': [
                                {
                                  dependencies: ['....authorization.type'],
                                  when: "{{$deps[0] === 'Bearer Token'}}",
                                  fulfill: {
                                    schema: {
                                      'x-visible': true,
                                    },
                                  },
                                  otherwise: {
                                    schema: {
                                      'x-visible': false,
                                    },
                                  },
                                },
                              ],
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
                              'x-reactions': [
                                {
                                  dependencies: ['....authorization.type'],
                                  when: "{{$deps[0] === 'Basic Auth'}}",
                                  fulfill: {
                                    schema: {
                                      'x-visible': true,
                                    },
                                  },
                                  otherwise: {
                                    schema: {
                                      'x-visible': false,
                                    },
                                  },
                                },
                              ],
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
                              'x-reactions': [
                                {
                                  dependencies: ['....authorization.type'],
                                  when: "{{$deps[0] === 'Basic Auth'}}",
                                  fulfill: {
                                    schema: {
                                      'x-visible': true,
                                    },
                                  },
                                  otherwise: {
                                    schema: {
                                      'x-visible': false,
                                    },
                                  },
                                },
                              ],
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
                    tab: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.headers"></TextWidget>
                    ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableSort"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableKey"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableValue"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableOperations"></TextWidget>
                              ),
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
                          title: (
                            <TextWidget token="flowDesigner.flow.form.comm.arrayTableAdd"></TextWidget>
                          ),
                        },
                      },
                    },
                  },
                },
                tab4: {
                  type: 'void',
                  'x-component': 'FormTab.TabPane',
                  'x-component-props': {
                    tab: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.body"></TextWidget>
                    ),
                  },
                  properties: {
                    contentType: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      required: true,
                      'x-component': 'Radio.Group',
                      default: 'none',
                      enum: [
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.httpCalls.enumNone"></TextWidget>
                          ),
                          value: 'none',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.httpCalls.enumFormData"></TextWidget>
                          ),
                          value: 'form-data',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.httpCalls.enumFormUrl"></TextWidget>
                          ),
                          value: 'x-www-form-urlencoded',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.httpCalls.enumRaw"></TextWidget>
                          ),
                          value: 'raw',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.httpCalls.enumBinary"></TextWidget>
                          ),
                          value: 'binary',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.httpCalls.enumGraphQL"></TextWidget>
                          ),
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
                      'x-visible': false,
                      // 'x-reactions': bodyReaction,
                      // 'x-reactions': [
                      //   {
                      //     dependencies: ['.contentType'],
                      //     when: "{{['form-data','x-www-form-urlencoded'].includes($deps[0])}}",
                      //     fulfill: {
                      //       schema: {
                      //         'x-visible': true,
                      //         type: 'array',
                      //         'x-component': 'ArrayTable',
                      //       },
                      //     },
                      //   },
                      //   {
                      //     dependencies: ['.contentType'],
                      //     when: "{{$deps[0] === 'raw'}}",
                      //     fulfill: {
                      //       schema: {
                      //         'x-visible': true,
                      //         type:'string',
                      //         'x-component': 'Input',
                      //       },
                      //     },
                      //     otherwise: {
                      //       schema: {
                      //         'x-visible': false,
                      //       },
                      //     },
                      //   },
                      // ],
                      items: {
                        type: 'object',
                        properties: {
                          column1: {
                            type: 'void',
                            'x-component': 'ArrayTable.Column',
                            'x-component-props': {
                              width: 50,
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableSort"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableKey"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableValue"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableOperations"></TextWidget>
                              ),
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
                          title: (
                            <TextWidget token="flowDesigner.flow.form.comm.arrayTableAdd"></TextWidget>
                          ),
                        },
                      },
                    },
                  },
                },
                tab5: {
                  type: 'void',
                  'x-component': 'FormTab.TabPane',
                  'x-component-props': {
                    tab: (
                      <TextWidget token="flowDesigner.flow.form.httpCalls.cookies"></TextWidget>
                    ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableSort"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableName"></TextWidget>
                              ),
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
                          // column4: {
                          //   type: 'void',
                          //   'x-component': 'ArrayTable.Column',
                          //   'x-component-props': {
                          //     width: 200,
                          //     title: 'DOMAIN',
                          //   },
                          //   required: true,
                          //   properties: {
                          //     domain: {
                          //       type: 'string',
                          //       'x-decorator': 'FormItem',
                          //       'x-component': 'Input',
                          //     },
                          //   },
                          // },
                          column6: {
                            type: 'void',
                            'x-component': 'ArrayTable.Column',
                            'x-component-props': {
                              width: 200,
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableValue"></TextWidget>
                              ),
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
                              title: (
                                <TextWidget token="flowDesigner.flow.form.comm.arrayTableOperations"></TextWidget>
                              ),
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
                          title: (
                            <TextWidget token="flowDesigner.flow.form.comm.arrayTableAdd"></TextWidget>
                          ),
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        result: {
          type: 'string',
          title: (
            <TextWidget token="flowDesigner.flow.form.httpCalls.result"></TextWidget>
          ),
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            layout: 'vertical',
            colon: false,
          },
          'x-component': 'Input',
        },
      },
    },
  },
}

export const httpCallsOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const metaFlow = node.metaFlow
  const isEdit = !node.make
  let formDialog = null
  const onCancel = () => {
    formDialog.close()
  }
  const onSubmit = (from) => {
    const paramData = convertHttpFormilyToJson(from.values)
    if (isEdit) {
      node.update(paramData)
    } else {
      node.make(at, { ...additionInfo, ...paramData })
    }
    formDialog.close()
  }
  const title = !isEdit ? (
    <TextWidget>flowDesigner.flow.form.httpCalls.addTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.flow.form.httpCalls.editTitle</TextWidget>
  )
  httpCallsSchema.properties.grid.properties.id['x-disabled'] = isEdit
  ;(httpCallsSchema.properties.grid.properties.callArguments.properties.grid.properties.url[
    'x-component-props'
  ] = {
    placeholder: useLocale('flowDesigner.flow.form.httpCalls.placeholderUrl'),
  }),
    (formDialog = FormDialog(
      {
        title: title,
        footer: null,
        open: false,
        width: '90vw',
      },
      <HttpCalls
        value={node}
        isEdit={isEdit}
        metaFlow={metaFlow}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    ))
  formDialog
    .forOpen((payload, next) => {
      next({})
    })
    .open()
}

export interface HttpCallsModelPorps {
  value?: FlowMetaParam
  metaFlow: AutoFlow
  onCancel: () => void
  onSubmit: (from) => void
  isEdit: boolean
}

export const HttpCalls: FC<HttpCallsModelPorps> = ({
  value,
  onCancel,
  onSubmit,
  metaFlow,
  isEdit,
}) => {
  const form = createForm({
    effects: () => {
      onFieldValueChange('callArguments.contentType', (field) => {
        switch (field.value) {
          case IContentTypeEnum.FORM_DATA:
          case IContentTypeEnum.X_WWW_FORM_URLENCODED:
            form.setFieldState('callArguments.body', (state) => {
              state.componentType = 'ArrayTable'
              state.visible = true
            })
            break
          case IContentTypeEnum.raw:
            form.setFieldState('callArguments.body', (state) => {
              state.componentType = 'Input'
              state.visible = true
            })
            break
          default:
            form.setFieldState('callArguments.body', (state) => {
              state.visible = false
            })
            break
        }
      })
    },
  })

  if (value) {
    const flowData = clone(value)
    if (isEdit) {
      form.initialValues = converHttpJsonToFormily({
        name: flowData.type,
        description: flowData.description,
        id: flowData.id,
        callArguments: flowData.callArguments,
        result: flowData.result,
      })
    } else {
      form.initialValues = {
        id: flowData.id,
        name: flowData.name,
        description: flowData.description,
      }
    }
  }

  formTab.setActiveKey('tab1')

  switch (value.callArguments && value.callArguments.contentType) {
    case IContentTypeEnum.FORM_DATA:
    case IContentTypeEnum.X_WWW_FORM_URLENCODED:
      form.setFieldState('callArguments.body', (state) => {
        state.componentType = 'ArrayTable'
        state.visible = true
      })
      break
    case IContentTypeEnum.raw:
      form.setFieldState('callArguments.body', (state) => {
        state.componentType = 'Input'
        state.visible = true
      })
      break
    default:
      form.setFieldState('callArguments.body', (state) => {
        state.visible = false
      })
      break
  }

  return (
    <>
      <FormLayout layout="vertical" colon={false}>
        <FormProvider form={form}>
          <SchemaField schema={httpCallsSchema} scope={{ formTab }} />
          <FormDialog.Footer>
            <Button onClick={() => onCancel()}>
              <TextWidget>flowDesigner.comm.cancel</TextWidget>
            </Button>
            <Submit onSubmit={() => onSubmit(form)}>
              <TextWidget>flowDesigner.comm.submit</TextWidget>
            </Submit>
          </FormDialog.Footer>
        </FormProvider>
      </FormLayout>
    </>
  )
}
