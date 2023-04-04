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
import { assignOnEdit } from './FlowAssignment'
import { decideOnEdit } from './FlowDecision'
import { loopOnEdit } from './FlowLoop'
import { recordCreateOnEdit } from './FlowRecordCreate'
import { recordDeleteOnEdit } from './FlowRecordDelete'
import { recordUpdateOnEdit } from './FlowRecordUpdate'
import { recordLookUpOnEdit } from './FlowRecordLookUp'
import { httpCallsOnEdit } from './FlowHttpCalls'
import { variableOnEdit } from './FlowShortcut'

export * from './addNode'
export * from './connectDialog'

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

const waitPanelSchema = {
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
    pauseInfo: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': () => {
        return (
          <div>
            Add a pause configuration for each event that can resume the flow.
            Such an event can be a specified time or a platform event message.
            Pause conditions determine whether to pause the flow until the event
            occurs. When no pause conditions are met, the flow takes the default
            path without pausing.
          </div>
        )
      },
    },
    waitEvents: {
      type: 'array',
      title: '暂停选项',
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
            title: 'Pause Configuration API Name',
            required: true,
            'x-component': 'Input',
          },
          id: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              layout: 'virtical',
            },
            title: 'Pause Configuration API Id',
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
}

// const assignRender = () => {
//   return FormDialog(
//     { title: `AssignMent Node Properites`, width: '60vw' },
//     () => {
//       return (
//         <FormLayout labelCol={6} wrapperCol={10}>
//           <SchemaField schema={assignPanelSchema} />
//         </FormLayout>
//       )
//     }
//   )
// }

const waitRender = () => {
  return FormDialog({ title: `Pause Node Properites`, width: '90vw' }, () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <SchemaField schema={waitPanelSchema} />
      </FormLayout>
    )
  })
}

const recordCreateRender = () => {
  return FormDialog({ title: `New Create Records`, width: '90vw' }, () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <SchemaField schema={assignNodeSchema} />
      </FormLayout>
    )
  })
}

export const waitOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = waitRender()
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

// export const recordCreateOnEdit = (
//   node: any,
//   at?: string,
//   additionInfo?: any
// ) => {
//   const dialog = recordCreateRender()
//   dialog
//     .forOpen((payload, next) => {
//       setTimeout(() => {
//         next({
//           initialValues: {
//             name: node.name,
//             description: node.description,
//           },
//         })
//       }, 500)
//     })
//     .forConfirm((payload, next) => {
//       setTimeout(() => {
//         node.make
//           ? node.make(at, { ...payload.values, ...additionInfo })
//           : node.update(payload.values)
//         next(payload)
//       }, 500)
//     })
//     .forCancel((payload, next) => {
//       setTimeout(() => {
//         next(payload)
//       }, 500)
//     })
//     .open()
// }

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
      case FlowMetaType.RECORD_DELETE:
        return recordDeleteOnEdit(node, at, additionInfo)
      case FlowMetaType.RECORD_UPDATE:
        return recordUpdateOnEdit(node, at, additionInfo)
      case FlowMetaType.RECORD_LOOKUP:
        return recordLookUpOnEdit(node, at, additionInfo)
      case FlowMetaType.HTTP_CALL:
        return httpCallsOnEdit(node, at, additionInfo)
      case FlowMetaType.SHORT_CUT:
        return variableOnEdit(node, at, additionInfo)
      default:
        return null
    }
  }
  chooseDialog()
}
