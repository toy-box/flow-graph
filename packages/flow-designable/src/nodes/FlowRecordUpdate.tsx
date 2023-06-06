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
  Submit,
} from '@formily/antd'
import { createSchemaField, FormProvider } from '@formily/react'
import {
  FlowMetaParam,
  ICriteriaCondition,
  IInputAssignment,
  opTypeEnum,
} from '@toy-box/autoflow-core'
import { createForm, onFieldValueChange } from '@formily/core'
import { Button } from 'antd'
import { useLocale, TextWidget } from '@toy-box/studio-base'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { clone } from '@designable/shared'
import { ResourceSelect, OperationSelect } from '../components/formily'

import './flowNodes.less'
import { apiReg, IResourceMetaflow } from '../interface'
import { setResourceMetaflow } from '../utils'
import { RepeatErrorMessage } from './RepeatErrorMessage'

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
    ResourceSelect,
    OperationSelect,
    ArrowLeftOutlinedIcon,
  },
})

const submitParamData = (values) => {
  const value = values
  const conditions = value?.criteria?.conditions?.map(
    (data: ICriteriaCondition) => {
      return {
        fieldPattern: data.fieldPattern,
        operation: data.operation,
        value: data.value,
      }
    }
  )
  const inputAssignments = value.inputAssignments?.map(
    (data: IInputAssignment) => {
      return {
        field: data.field,
        value: data.value,
      }
    }
  )
  const paramData = {
    id: value.id,
    name: value.name,
    registerId: value.registerId,
    callArguments: {
      criteria:
        value.criteria.logic === '$and'
          ? {
              conditions,
              logic: value.criteria.logic || '$and',
            }
          : null,
      inputAssignments,
    },
  }
  return paramData
}

export const recordUpdateOnEdit = (
  node: any,
  at?: string,
  additionInfo?: any
) => {
  const metaFlow = node.metaFlow
  const resourceMetaflow = setResourceMetaflow(metaFlow)
  const isEdit = !node.make
  let formDialog = null
  const onCancel = () => {
    formDialog.close()
  }
  const onSubmit = (from) => {
    const paramData = submitParamData(from.values)
    if (isEdit) {
      node.update(paramData)
    } else {
      node.make(at, { ...additionInfo, ...paramData })
    }
    formDialog.close()
  }
  const title = !isEdit ? (
    <TextWidget>flowDesigner.flow.form.recordUpdate.addTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.flow.form.recordUpdate.editTitle</TextWidget>
  )
  formDialog = FormDialog(
    {
      title: title,
      footer: null,
      open: false,
      width: '60vw',
    },
    <RecordUpdate
      value={isEdit ? node : null}
      isEdit={isEdit}
      metaFlow={resourceMetaflow}
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

export interface RecordUpdateModelPorps {
  value?: FlowMetaParam
  metaFlow: IResourceMetaflow
  onCancel: () => void
  onSubmit: (from) => void
  isEdit: boolean
}

export const RecordUpdate: FC<RecordUpdateModelPorps> = ({
  value,
  onCancel,
  onSubmit,
  metaFlow,
  isEdit,
}) => {
  const filterName = useLocale('flowDesigner.flow.form.recordUpdate.filter')
  const record = useLocale('flowDesigner.flow.form.recordUpdate.record')
  const setName = useLocale('flowDesigner.flow.form.recordUpdate.setting')
  const setField = useLocale('flowDesigner.flow.form.recordUpdate.setField')

  const form = createForm({
    effects: () => {
      onFieldValueChange('registerId', (field) => {
        const registers = metaFlow.registers
        const register = registers.find((rg) => rg.id === field.value)
        if (register) {
          form.setFieldState('criteria.conditions', (state) => {
            state.title = `${filterName} ${register.name} ${record}`
            state.value = []
          })
          form.setFieldState('inputAssignments', (state) => {
            state.title = `${setName} ${register.name} ${setField}`
            state.value = []
          })
        }
      })
    },
  })

  if (value) {
    const flowData = clone(value)
    const callArguments = flowData.callArguments
    form.initialValues = {
      id: flowData.id,
      name: flowData.name,
      registerId: flowData.registerId,
      criteria: callArguments?.criteria ?? {
        conditions: [],
        logic: 'none',
      },
      inputAssignments: callArguments?.inputAssignments,
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
                validator: (val: string) => {
                  if (!val) return null
                  const message = new RepeatErrorMessage(
                    metaFlow,
                    val,
                    value,
                    apiReg
                  )
                  return (
                    message.errorMessage && (
                      <TextWidget>{message.errorMessage}</TextWidget>
                    )
                  )
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
                flowDesigner.flow.form.recordUpdate.registerId
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
              rank: 'single',
              metaFlow,
            },
          },
          web: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
          },
          criteria: {
            type: 'object',
            'x-reactions': {
              dependencies: ['registerId'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps != '' ? 'visible' : 'none'}}",
                },
              },
            },
            properties: {
              logic: {
                type: 'string',
                title: (
                  <TextWidget token="flowDesigner.flow.form.recordUpdate.filterTitle"></TextWidget>
                ),
                required: true,
                default: '$and',
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
                      <TextWidget token="flowDesigner.flow.form.decision.logicNone"></TextWidget>
                    ),
                    value: 'none',
                  },
                  {
                    label: (
                      <TextWidget token="flowDesigner.flow.form.decision.logicAnd"></TextWidget>
                    ),
                    value: '$and',
                  },
                  //   {
                  //     label: (
                  //       <TextWidget token="flowDesigner.flow.form.decision.logicOr"></TextWidget>
                  //     ),
                  //     value: '$or',
                  //   },
                  //   {
                  //     label: (
                  //       <TextWidget token="flowDesigner.flow.form.decision.logicCustom"></TextWidget>
                  //     ),
                  //     value: '$custom',
                  //   },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  wrapperWidth: 350,
                },
                'x-component-props': {},
                'x-component': 'Select',
                'x-reactions': {
                  target: 'grid.criteria.conditions.*.grid.case',
                  fulfill: {
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
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems',
                'x-reactions': {
                  dependencies: ['criteria.logic'],
                  fulfill: {
                    schema: {
                      'x-display': "{{$deps == '$and' ? 'visible' : 'none'}}",
                    },
                  },
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
                        },
                        fieldPattern: {
                          type: 'string',
                          title: (
                            <TextWidget>
                              flowDesigner.flow.form.recordUpdate.field
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
                          'x-component': 'ResourceSelect',
                          'x-component-props': {
                            sourceMode: 'objectService',
                            objectKey: 'registerId',
                            metaFlow: metaFlow,
                            typeKey: 'type',
                            isSetType: true,
                            placeholder: useLocale(
                              'flowDesigner.flow.form.comm.operationPlace'
                            ),
                          },
                        },
                        type: {
                          type: 'string',
                          title: '',
                        },
                        operation: {
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
                          'x-component': 'OperationSelect',
                          'x-component-props': {
                            placeholder: useLocale(
                              'flowDesigner.flow.form.comm.typePlace'
                            ),
                            reactionKey: 'fieldPattern',
                            reactionTypeKey: 'type',
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
                          'x-component': 'ResourceSelect',
                          'x-component-props': {
                            placeholder: useLocale(
                              'flowDesigner.flow.form.comm.valuePlace'
                            ),
                            metaFlow: metaFlow,
                            reactionKey: 'fieldPattern',
                            reactionTypeKey: 'type',
                            isInput: true,
                            isFormula: true,
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
                    title: (
                      <TextWidget>
                        flowDesigner.flow.form.recordUpdate.addBtn
                      </TextWidget>
                    ),
                    'x-component': 'ArrayItems.Addition',
                    'x-component-props': {
                      style: {
                        width: '200px',
                      },
                    },
                  },
                },
              },
            },
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
                    flowDesigner.flow.form.recordUpdate.inputAssignments
                  </TextWidget>
                ),
              },
            ],
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordUpdate.inputAssignments
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
                          flowDesigner.flow.form.recordUpdate.field
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
                        objectKey: 'registerId',
                        metaFlow: metaFlow,
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
                        reactionTypeKey: 'type',
                        isInput: true,
                        isFormula: true,
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
                title: (
                  <TextWidget>
                    flowDesigner.flow.form.recordRemove.addBtn
                  </TextWidget>
                ),
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
