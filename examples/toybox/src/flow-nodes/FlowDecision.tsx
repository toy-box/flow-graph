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
  Form,
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import * as ICONS from '@ant-design/icons'
import { createForm } from '@formily/core'
import { observable } from '@formily/reactive'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { TextWidget, takeMessage } from '../widgets'

import { BranchArrays } from '../components/formily'
import './flowNodes.less'

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

// const form = createForm()
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
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name])
    },
    //   asyncVisible(field) {
    //     // setTimeout(() => {
    //       // form.setFieldState('grid.rules.*.criteria.conditions.*.grid.case', (state) => {
    //         //对于初始联动，如果字段找不到，setFieldState会将更新推入更新队列，直到字段出现再执行操作
    //         // if (state.index) {
    //         //   state.title = field.value.slice(1).toUpperCase()
    //         // }
    //       // })
    //     // }, 1000)
    //   },
  },
})

// const obs = observable({
//   logic: '',
// })

const decideRender = (isNew: boolean) => {
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
          name: {
            type: 'string',
            title: (
              <TextWidget token="flowDesigner.flow.form.comm.label"></TextWidget>
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
            },
            'x-component': 'Input',
          },
          id: {
            type: 'string',
            title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
            required: false,
            'x-validator': [
              {
                triggerType: 'onBlur',
                // required: true,
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
            },
            'x-component': 'Input',
            'x-component-props': {
              disabled: true,
            },
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
            'x-component': 'descTipHtml',
            'x-decorator-props': {
              gridSpan: 2,
              feedbackLayout: 'terse',
            },
          },
          defaultConnectorName: {
            type: 'string',
            title: (
              <TextWidget token="flowDesigner.flow.form.decision.defaultConnectorName"></TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
              layout: 'vertical',
              colon: false,
            },
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
          },
          rules: {
            type: 'array',
            // title: <TextWidget token="flowDesigner.flow.form.decision.ruleTitle"></TextWidget>,
            title: '',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'BranchArrays',
            'x-component-props': {
              title: (
                <TextWidget token="flowDesigner.flow.form.decision.ruleTitle"></TextWidget>
              ),
              addDescription: (
                <TextWidget>
                  flowDesigner.flow.form.decision.ruleTitle
                </TextWidget>
              ),
            },
            items: {
              type: 'object',
              properties: {
                layout: {
                  type: 'void',
                  'x-component': 'FormLayout',
                  'x-component-props': {
                    gridSpan: 2,
                    layout: 'vertical',
                    colon: false,
                    removeMessage: (
                      <TextWidget>
                        flowDesigner.flow.form.decision.removeResult
                      </TextWidget>
                    ),
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                        colon: false,
                      },
                      title: (
                        <TextWidget token="flowDesigner.flow.form.decision.ruleLabel"></TextWidget>
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
                      'x-component': 'Input',
                    },
                    id: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                        colon: false,
                      },
                      title: (
                        <TextWidget token="flowDesigner.flow.form.decision.ruleId"></TextWidget>
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
                      'x-component': 'Input',
                    },
                  },
                },
                criteria: {
                  type: 'object',
                  properties: {
                    logic: {
                      type: 'string',
                      title: (
                        <TextWidget token="flowDesigner.flow.form.decision.logicTitle"></TextWidget>
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
                            <TextWidget token="flowDesigner.flow.form.decision.logicAnd"></TextWidget>
                          ),
                          value: '$and',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.decision.logicOr"></TextWidget>
                          ),
                          value: '$or',
                        },
                        {
                          label: (
                            <TextWidget token="flowDesigner.flow.form.decision.logicCustom"></TextWidget>
                          ),
                          value: '$custom',
                        },
                      ],
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        layout: 'vertical',
                        colon: false,
                        wrapperWidth: 350,
                      },
                      'x-component-props': {},
                      'x-component': 'Select',
                      'x-reactions': {
                        target: 'grid.rules.*.criteria.conditions.*.grid.case',
                        fulfill: {
                          // run: 'asyncVisible($self,$target)',
                          state: {
                            title:
                              '{{$target.index !== 0 && $self.value.substring(1).toUpperCase()}}',
                          },
                        },
                      },
                    },
                    conditions: {
                      type: 'array',
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
                      title: '',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems',
                      items: {
                        type: 'object',
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
                              maxColumns: 18,
                              minColumns: 18,
                              style: {
                                width: '100%',
                              },
                            },
                            properties: {
                              case: {
                                type: 'void',
                                'x-decorator': 'FormItem',
                                'x-decorator-props': {
                                  colon: false,
                                  style: {
                                    alignItems: 'center',
                                    marginTop: '22px',
                                    fontWeight: 700,
                                  },
                                  gridSpan: 1,
                                },
                                // 'x-component': (value)=>{
                                //   console.log('value', value)
                                //   return <div></div>
                                // },
                              },
                              operation: {
                                type: 'string',
                                title: (
                                  <TextWidget>
                                    flowDesigner.flow.form.decision.operationTitle
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
                                'x-decorator': 'FormItem',
                                'x-decorator-props': {
                                  layout: 'vertical',
                                  colon: false,
                                  gridSpan: 4,
                                  labelWidth: '100px',
                                },
                                'x-component': 'Input',
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
                          title: 'Add Condition',
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
            },
          },
        },
      },
    },
  }
  const getToken = isNew
    ? 'flowDesigner.flow.form.decision.addTitle'
    : 'flowDesigner.flow.form.decision.editTitle'
  return FormDialog(
    {
      title: <TextWidget>{getToken}</TextWidget>,
      width: '90vw',
    },
    () => {
      // const decideForm = createForm()
      // decideForm.setInitialValues({
      // })
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={decidePanelSchema} />
        </FormLayout>
      )
    }
  )
}

export const decideOnEdit = (node: any, at?: string, additionInfo?: any) => {
  console.log('node', node)
  const dialog = decideRender(node.make)
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            defaultConnectorName: node.defaultConnectorName,
            id: node.id,
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
