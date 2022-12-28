import React from 'react'
import {
  FormDialog,
  FormItem,
  FormLayout,
  Input,
  Select,
  FormGrid,
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { Divider } from 'antd'
import { TextWidget } from '../widgets'

export * from './addNode'

const AssignmentDesc = () => {
  return (
    <div>
      <Divider />
      <div className="assignment-content">
        <div className="assignment-title">
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
    Input,
    Select,
    AssignmentDesc,
  },
})

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
          'x-component': 'AssignmentDesc',
          'x-decorator-props': {
            gridSpan: 2,
          },
        },
        assignmentItems: {
          type: 'object',
          properties: {
            titleVariable: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': () => {
                return (
                  <div style={{ fontSize: '1rem' }}>Set Variable Values</div>
                )
              },
            },
            textVariable: {
              type: 'void',
              'x-decorator': 'FormItem',
              'x-component': () => {
                return (
                  <div>
                    Each variable is modified by the operator and value
                    combination.
                  </div>
                )
              },
            },
            operation: {
              type: 'string',
              title: 'Variable',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            type: {
              type: 'string',
              title: 'Operator',
              required: true,
              enum: [
                {
                  label: 'Equals',
                  value: 'Equals',
                },
                {
                  label: 'Add',
                  value: 'Add',
                },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            value: {
              type: 'string',
              title: 'Value',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
}

const assignRender = () => {
  return FormDialog(
    {
      title: (
        <TextWidget token="flowDesigner.flow.form.assignment.addTitle"></TextWidget>
      ),
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
  const dialog = assignRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            assignmentItems: node.assignmentItems,
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

export const recordCreateOnEdit = (
  node: any,
  at?: string,
  additionInfo?: any
) => {
  const dialog = recordCreateRender()
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
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

export const onPanelEdit = (
  node: INodeTemplate<NodeMake> | FlowMetaNode,
  at: string,
  additionInfo?: any
) => {
  const chooseDialog = () => {
    switch (node.type) {
      case FlowMetaType.ASSIGNMENT:
        return assignOnEdit(node, at, additionInfo)
      case FlowMetaType.DECISION:
        return decideOnEdit(node, at, additionInfo)
      case FlowMetaType.LOOP:
        return loopOnEdit(node, at, additionInfo)
      case FlowMetaType.WAIT:
        return waitOnEdit(node, at, additionInfo)
      case FlowMetaType.RECORD_CREATE:
        return recordCreateOnEdit(node, at, additionInfo)
      default:
        return recordCreateOnEdit(node, at, additionInfo)
    }
  }
  chooseDialog()
}
