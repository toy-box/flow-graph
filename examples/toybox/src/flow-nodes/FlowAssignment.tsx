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
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import * as ICONS from '@ant-design/icons'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { useLocale } from '../hooks'
import { TextWidget, takeMessage } from '../widgets'

import './flowNodes.less'

const AssignmentDesc = () => {
  return (
    <div>
      <Divider className="margin-0" />
      <div className="assignment-content">
        <div className="assignment-title connectDialog-title">
          <TextWidget>flowDesigner.flow.form.assignment.setVariable</TextWidget>
        </div>
        <div className="assignment-desc">
          <TextWidget>flowDesigner.flow.form.assignment.tip</TextWidget>
        </div>
      </div>
    </div>
  )
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    ArrayItems,
    Input,
    Select,
    AssignmentDesc,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name])
    },
  },
})

const assignRender = (isNew: boolean) => {
  const assignPanelSchema = {
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
          assignmentItems: {
            type: 'array',
            required: true,
            title: '',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'ArrayItems',
            items: {
              type: 'object',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                gridSpan: 2,
                fullness: true,
                // feedbackLayout: 'terse',
              },
              'x-component': 'ArrayItems.Item',
              'x-component-props': {
                style: {
                  border: 'none',
                  padding: 0,
                },
              },
              properties: {
                grid: {
                  type: 'void',
                  'x-component': 'FormGrid',
                  'x-component-props': {
                    maxColumns: 17,
                    minColumns: 17,
                    style: {
                      width: '100%',
                    },
                  },
                  properties: {
                    operation: {
                      type: 'string',
                      title: (
                        <TextWidget>
                          flowDesigner.flow.form.comm.operationTitle
                        </TextWidget>
                      ),
                      required: true,
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
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                        colon: false,
                        gridSpan: 6,
                        labelWidth: '100px',
                      },
                      'x-component': 'Input',
                      'x-component-props': {
                        suffix: "{{icon('SearchOutlined')}}",
                        placeholder: takeMessage(
                          'flowDesigner.flow.form.comm.operationPlace'
                        ),
                      },
                    },
                    type: {
                      type: 'string',
                      title: (
                        <TextWidget>
                          flowDesigner.flow.form.comm.typeTitle
                        </TextWidget>
                      ),
                      required: true,
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
                      enum: [
                        {
                          label: (
                            <TextWidget>
                              flowDesigner.flow.form.assignment.typeEquals
                            </TextWidget>
                          ),
                          value: 'Equals',
                        },
                        {
                          label: (
                            <TextWidget>
                              flowDesigner.flow.form.assignment.typeAdd
                            </TextWidget>
                          ),
                          value: 'Add',
                        },
                      ],
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                        colon: false,
                        gridSpan: 4,
                        labelWidth: '100px',
                      },
                      'x-component': 'Select',
                      'x-component-props': {
                        placeholder: takeMessage(
                          'flowDesigner.flow.form.comm.typePlace'
                        ),
                      },
                    },
                    value: {
                      type: 'string',
                      title: (
                        <TextWidget>
                          flowDesigner.flow.form.comm.valueTitle
                        </TextWidget>
                      ),
                      required: true,
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
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                        colon: false,
                        gridSpan: 6,
                        labelWidth: '100px',
                      },
                      'x-component': 'Input',
                      'x-component-props': {
                        suffix: "{{icon('SearchOutlined')}}",
                        placeholder: takeMessage(
                          'flowDesigner.flow.form.comm.valuePlace'
                        ),
                      },
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        style: {
                          alignItems: 'center',
                          marginTop: '22px',
                        },
                        gridSpan: 1,
                      },
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: 'Add Assignment',
                'x-component': 'ArrayItems.Addition',
                'x-component-props': {
                  style: {
                    width: '30%',
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
    ? 'flowDesigner.flow.form.assignment.addTitle'
    : 'flowDesigner.flow.form.assignment.editTitle'
  return FormDialog(
    {
      title: <TextWidget>{getToken}</TextWidget>,
      width: '60vw',
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={assignPanelSchema} />
        </FormLayout>
      )
    }
  )
}

export const assignOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = assignRender(node.make)
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
      setTimeout(() => {
        console.log('assign payload', payload.values)
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
