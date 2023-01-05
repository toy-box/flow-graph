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
import { TextWidget, takeMessage } from '../widgets'

const DecisionDesc = () => {
  return (
    <div>
      <Divider />
      <div className="decision-content">
        <div className="decision-title">
          <TextWidget>flowDesigner.flow.form.decision.tipTitle</TextWidget>
        </div>
        <div className="decision-desc">
          <TextWidget>flowDesigner.flow.form.decision.tip</TextWidget>
        </div>
      </div>
    </div>
  )
}

const SchemaField = createSchemaField({
  components: {
    DecisionDesc,
    ArrayTabs,
    ArrayItems,
    FormItem,
    FormGrid,
    Input,
    Select,
    Radio,
  },
})

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
        desc: {
          type: 'string',
          title: '',
          'x-decorator': 'FormItem',
          'x-component': 'DecisionDesc',
          'x-decorator-props': {
            gridSpan: 2,
          },
        },
        rules: {
          type: 'array',
          title: takeMessage('flowDesigner.flow.form.decision.ruleTitle'),
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            layout: 'vertical',
            gridSpan: 2,
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
                title: (
                  <TextWidget token="flowDesigner.flow.form.decision.ruleLabel"></TextWidget>
                ),
                required: true,
                'x-component': 'Input',
              },
              id: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  layout: 'virtical',
                },
                title: (
                  <TextWidget token="flowDesigner.flow.form.decision.ruleId"></TextWidget>
                ),
                required: true,
                'x-component': 'Input',
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
                            placeholder: takeMessage(
                              'flowDesigner.flow.form.decision.operationPlace'
                            ),
                          },
                        },
                        type: {
                          type: 'string',
                          title: 'operator',
                          required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: takeMessage(
                              'flowDesigner.flow.form.decision.typePlace'
                            ),
                          },
                        },
                        value: {
                          type: 'string',
                          title: 'value',
                          required: true,
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: takeMessage(
                              'flowDesigner.flow.form.decision.valuePlace'
                            ),
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
          <SchemaField schema={decidePanelSchema} />
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
