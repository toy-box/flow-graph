import React, { FC, useCallback } from 'react'
import {
  FormDialog,
  Input,
  FormItem,
  Select,
  FormLayout,
  FormGrid,
  Space,
  ArrayItems,
  Switch,
  Submit,
} from '@formily/antd'
import { createSchemaField, FormProvider } from '@formily/react'
import {
  FlowMetaParam,
  FlowResourceType,
  FreeFlow,
  IInputAssignment,
  MetaFlow,
  opTypeEnum,
} from '@toy-box/autoflow-core'
import { createForm, onFieldValueChange } from '@formily/core'
import { Button } from 'antd'
import { useLocale, TextWidget } from '@toy-box/studio-base'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { clone } from '@designable/shared'
import { ResourceSelect } from '../components/formily'

import './flowNodes.less'

const ArrowLeftOutlinedIcon = () => {
  return <ArrowLeftOutlined />
}

const SchemaField = createSchemaField({
  components: {
    Space,
    ArrayItems,
    FormItem,
    FormGrid,
    Input,
    Select,
    Switch,
    ResourceSelect,
    ArrowLeftOutlinedIcon,
  },
})

const submitParamData = (values) => {
  const value = values
  const inputAssignments = value.inputAssignments.map(
    (data: IInputAssignment) => {
      return {
        field: data.field,
        type: data.type || opTypeEnum.INPUT,
        value: data.value,
      }
    }
  )
  const paramData = {
    id: value.id,
    name: value.name,
    registerId: value.registerId,
    inputAssignments: inputAssignments,
    storeOutputAutomatically: value.storeOutputAutomatically,
    assignRecordIdToReference: value.assignRecordIdToReference,
  }
  return paramData
}

export const recordCreateOnEdit = (
  node: any,
  at?: string,
  additionInfo?: any
) => {
  const metaFlow = node.metaFlow
  const isEdit = !node.make
  let formDialog = null
  const onCancel = () => {
    formDialog.close()
  }
  const onSubmit = (from) => {
    const paramData = submitParamData(from.values)
    if (isEdit) {
      node.updata(paramData)
    } else {
      node.make(at, { ...paramData, ...additionInfo })
    }
    formDialog.close()
  }
  const title = !isEdit ? (
    <TextWidget>flowDesigner.flow.form.recordCreate.addTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.flow.form.recordCreate.editTitle</TextWidget>
  )
  formDialog = FormDialog(
    {
      title: title,
      footer: null,
      open: false,
      width: '60vw',
    },
    <RecordCreate
      value={node}
      isEdit={isEdit}
      metaFlow={metaFlow}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
  formDialog
    .forOpen((payload, next) => {
      next({})
    })
    .open()
}

export interface RecordCreateModelPorps {
  value?: FlowMetaParam
  metaFlow: FreeFlow | MetaFlow
  onCancel: () => void
  onSubmit: (from) => void
  isEdit: boolean
}

export const RecordCreate: FC<RecordCreateModelPorps> = ({
  value,
  onCancel,
  onSubmit,
  metaFlow,
  isEdit,
}) => {
  const setName = useLocale('flowDesigner.flow.form.recordCreate.setting')
  const setField = useLocale('flowDesigner.flow.form.recordCreate.setField')
  const saveId = useLocale('flowDesigner.flow.form.recordCreate.saveId')

  const form = createForm({
    effects: () => {
      onFieldValueChange('registerId', (field) => {
        const registers = metaFlow.registers
        const register = registers.find((rg) => rg.id === field.value)
        if (register) {
          form.setFieldState('inputAssignments', (state) => {
            state.title = `${setName} ${register.name} ${setField}`
            state.value = []
          })
          form.setFieldState('assignRecordIdToReference', (state) => {
            state.title = `${saveId} ${register.name} ID`
          })
        }
      })
    },
  })

  if (value) {
    const flowData = clone(value)
    form.initialValues = {
      id: flowData.id,
      name: flowData.name,
      registerId: flowData.registerId,
      inputAssignments: flowData.inputAssignments,
      storeOutputAutomatically: flowData.storeOutputAutomatically,
      assignRecordIdToReference: flowData.assignRecordIdToReference,
    }
  }

  const myReaction = useCallback(
    (field: any) => {
      const val = form.values
      const registerId = val.registerId
      field.display = registerId ? 'visible' : 'none'
    },
    [form.values]
  )

  const schema = {
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
            title: <TextWidget>flowDesigner.flow.form.comm.label</TextWidget>,
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>flowDesigner.flow.form.validator.label</TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          id: {
            type: 'string',
            title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
            required: true,
            'x-disabled': isEdit,
            'x-validator': [
              {
                triggerType: 'onBlur',
                required: true,
                message: (
                  <TextWidget>
                    flowDesigner.flow.form.validator.value
                  </TextWidget>
                ),
              },
              {
                triggerType: 'onBlur',
                validator: (value: string) => {
                  if (!value) return null
                  // const message = new RepeatErrorMessage(
                  //   flowGraph,
                  //   value,
                  //   metaFlowData,
                  //   apiReg
                  // )
                  // return (
                  //   message.errorMessage && (
                  //     <TextWidget>{message.errorMessage}</TextWidget>
                  //   )
                  // )
                },
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          description: {
            type: 'string',
            title: (
              <TextWidget>flowDesigner.flow.form.comm.description</TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          registerId: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordCreate.registerId
              </TextWidget>
            ),
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.registerId
                </TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'ResourceSelect',
            'x-component-props': {
              sourceMode: 'objectService',
              metaFlow,
            },
          },
          web: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
          },
          inputAssignments: {
            type: 'array',
            required: true,
            'x-reactions': myReaction,
            'x-validator': [
              {
                triggerType: 'onBlur',
                required: false,
                message: (
                  <TextWidget>
                    flowDesigner.flow.form.recordCreate.inputAssignments
                  </TextWidget>
                ),
              },
            ],
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordCreate.inputAssignments
              </TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems',
            'x-decorator-props': {
              gridSpan: 2,
            },
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
                    maxColumns: 20,
                    minColumns: 20,
                    style: {
                      width: '100%',
                    },
                  },
                  properties: {
                    field: {
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
                        gridSpan: 9,
                        labelWidth: '100px',
                      },
                      'x-component': 'ResourceSelect',
                      'x-component-props': {
                        // suffix: "{{icon('SearchOutlined')}}",
                        sourceMode: 'objectService',
                        metaFlow,
                        objectKey: 'registerId',
                        placeholder: useLocale(
                          'flowDesigner.flow.form.comm.operationPlace'
                        ),
                      },
                    },
                    type: {
                      type: 'string',
                      title: '',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrowLeftOutlinedIcon',
                      'x-decorator-props': {
                        gridSpan: 1,
                        style: {
                          alignItems: 'center',
                          marginTop: '22px',
                          fontSize: '20px',
                          textAlign: 'center',
                        },
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
                        gridSpan: 9,
                        labelWidth: '100px',
                      },
                      'x-component': 'ResourceSelect',
                      'x-component-props': {
                        placeholder: useLocale(
                          'flowDesigner.flow.form.comm.valuePlace'
                        ),
                        metaFlow: metaFlow,
                        reactionKey: 'field',
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
          storeOutputAutomatically: {
            type: 'boolean',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordCreate.storeOutputAutomatically
              </TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': {
              dependencies: ['registerId'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps != '' ? 'visible' : 'none'}}",
                },
              },
            },
          },
          assignRecordIdToReference: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordCreate.assignRecordIdToReference
              </TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'ResourceSelect',
            'x-component-props': {
              placeholder: useLocale(
                'flowDesigner.flow.form.placeholder.assignRecordIdToReference'
              ),
              metaFlow,
              flowJsonTypes: [
                {
                  value: FlowResourceType.VARIABLE,
                },
                {
                  value: FlowResourceType.VARIABLE_RECORD,
                },
              ],
              // flowGraph,
            },
            'x-reactions': {
              dependencies: ['storeOutputAutomatically'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps == 'true' ? 'visible' : 'none'}}",
                },
              },
            },
          },
        },
      },
    },
  }

  return (
    <>
      <FormLayout layout="vertical" colon={false}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
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
