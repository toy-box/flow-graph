/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Radio,
  Checkbox,
} from '@formily/antd'
import { createSchemaField, FormProvider, observer } from '@formily/react'
import {
  FlowMetaParam,
  FlowResourceType,
  ICriteriaCondition,
  opTypeEnum,
} from '@toy-box/autoflow-core'
import { IFieldOption } from '@toy-box/meta-schema'
import { createForm, onFieldValueChange } from '@formily/core'
import { Button } from 'antd'
import { useLocale, TextWidget } from '@toy-box/studio-base'
import { ArrowRightOutlined } from '@ant-design/icons'
import { clone } from '@designable/shared'
import { isBool } from '@formily/shared'
import { ResourceSelect, OperationSelect } from '../components/formily'

import './flowNodes.less'
import { apiReg, IResourceMetaflow } from '../interface'
import { setResourceMetaflow } from '../utils'
import { RepeatErrorMessage } from './RepeatErrorMessage'

const ArrowRightOutlinedIcon = () => {
  return <ArrowRightOutlined />
}

const TextTemplate = observer((props: any) => {
  return <div style={props.style}>{props.textTemplate}</div>
})

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
    ArrowRightOutlinedIcon,
    Radio,
    Checkbox,
    TextTemplate,
  },
})

const submitParamData = (values) => {
  const value = values
  const queriedFields = value?.queriedFields?.map(
    (field: { field: string }) => {
      return field.field
    }
  )
  const conditions = value?.criteria?.conditions.map(
    (data: ICriteriaCondition) => {
      return {
        fieldPattern: data.fieldPattern,
        operation: data.operation,
        type: data.type || opTypeEnum.INPUT,
        value: data.value,
      }
    }
  )
  const paramData = {
    id: value.id,
    name: value.name,
    registerId: value.registerId,
    criteria:
      conditions && conditions.length > 0
        ? {
            conditions,
            logic: value.criteria.logic || '$and',
          }
        : null,
    outputAssignments: value?.outputAssignments,
    outputReference: value.address ? value.outputReference : undefined,
    queriedFields,
    sortOrder: value.sortOrder,
    sortField: value.sortField,
    storeOutputAutomatically: value.storeOutputAutomatically,
    getFirstRecordOnly: value.getFirstRecordOnly,
    assignNullValuesIfNoRecordsFound: value.assignNullValuesIfNoRecordsFound,
  }
  return paramData
}

export const recordLookUpOnEdit = (
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
    <RecordLookUp
      value={node}
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

export interface RecordLookUpModelPorps {
  value?: FlowMetaParam
  metaFlow: IResourceMetaflow
  onCancel: () => void
  onSubmit: (from) => void
  isEdit: boolean
}

export const RecordLookUp: FC<RecordLookUpModelPorps> = ({
  value,
  onCancel,
  onSubmit,
  metaFlow,
  isEdit,
}) => {
  const filterName = useLocale('flowDesigner.flow.form.recordLookUp.filter')
  const record = useLocale('flowDesigner.flow.form.recordLookUp.record')

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
          form.setFieldState('sortOrder', (state) => {
            state.value = null
          })
          form.setFieldState('sortField', (state) => {
            state.value = undefined
          })
        } else {
          form.setFieldState('outputAssignments', (state) => {
            state.value = undefined
          })
          form.setFieldState('outputReference', (state) => {
            state.value = undefined
          })
          form.setFieldState('queriedFields', (state) => {
            state.value = undefined
          })
        }
      })
      onFieldValueChange('getFirstRecordOnly', (field) => {
        const registerId = field.query('registerId').get('value')
        const automaticallyType = field.query('automaticallyType').get('value')
        if (field.value && registerId && automaticallyType === false) {
          form.setFieldState('address', (state) => {
            state.value = true
          })
        }
      })
      onFieldValueChange('storeOutputAutomatically', (field) => {
        form.setFieldState('automaticallyType', (state) => {
          state.value = !field.value ? true : undefined
        })
        form.setFieldState('outputReference', (state) => {
          state.value = undefined
        })
        form.setFieldState('queriedFields', (state) => {
          state.value = undefined
        })
      })
      onFieldValueChange('automaticallyType', (field) => {
        form.setFieldState('outputReference', (state) => {
          state.value = undefined
        })
      })
      onFieldValueChange('address', (field) => {
        form.setFieldState('outputReference', (state) => {
          state.value = undefined
        })
      })
    },
  })

  if (value) {
    const flowData = clone(value)
    let address = false
    let automaticallyType = false
    if (flowData.queriedFields && !flowData.outputReference) {
      automaticallyType = true
    } else {
      automaticallyType = false
      if (!flowData.outputReference) {
        address = false
      } else {
        address = true
      }
    }
    const queriedFields = flowData?.queriedFields?.map((field: string) => {
      return {
        field: field,
      }
    })
    form.initialValues = {
      id: flowData.id,
      name: flowData.name,
      registerId: flowData.registerId,
      criteria: flowData.criteria,
      queriedFields,
      address,
      automaticallyType,
      outputAssignments: flowData?.outputAssignments,
      outputReference: flowData.outputReference,
      sortOrder: flowData.sortOrder,
      sortField: flowData.sortField,
      storeOutputAutomatically: flowData.storeOutputAutomatically,
      getFirstRecordOnly: flowData.getFirstRecordOnly,
      assignNullValuesIfNoRecordsFound:
        flowData.assignNullValuesIfNoRecordsFound,
    }
  }

  const reactionField = useCallback(
    (type: string | number, field: any) => {
      const refObjectId = field.query('registerId').get('value')
      if (!refObjectId) return []
      const registers = metaFlow.registers
      const registerOps: IFieldOption[] = []
      registers.some((re) => {
        if (re.key === refObjectId) {
          for (const key in re.properties) {
            // eslint-disable-next-line no-prototype-builtins
            if (re.properties.hasOwnProperty(key)) {
              const obj = re.properties[key]
              const value = form.values
              const idx = value?.[type]?.findIndex(
                (option: any) => option.field === obj.key
              )
              const option = {
                label: obj.name,
                value: obj.key,
                type: obj.type,
                disabled: idx > -1,
              }
              registerOps.push(option)
            }
          }
          return true
        }
        return false
      })
      field.dataSource = registerOps
    },
    [form.values]
  )

  const storeOutputReaction = useCallback((field: any) => {
    const registerId = field.query('registerId').get('value')
    field.display = registerId ? 'visible' : 'none'
    form.setFieldState('automaticallyType', (state) => {
      state.value = field.value === false
    })
  }, [])

  const changeTypeOp = useCallback((field: any) => {
    const registerId = field.query('registerId').get('value')
    const storeOutputAutomatically = field
      .query('storeOutputAutomatically')
      .get('value')
    field.display = !storeOutputAutomatically && registerId ? 'visible' : 'none'
    const flag = field.value
    form.setFieldState('queriedFields', (state) => {
      state.display = flag ? 'visible' : 'none'
      state.value = []
    })
  }, [])

  const myReaction = useCallback(
    (type: string, field: any) => {
      const val = form.values
      const sortOrder = val.sortOrder
      if (type === 'sortOrderIsEmpty') {
        field.display = sortOrder === null ? 'visible' : 'none'
      } else {
        field.display =
          sortOrder === 'asc' || sortOrder === 'desc' ? 'visible' : 'none'
      }
    },
    [form.values]
  )

  const reactionQueriedFields = useCallback(
    (field: any) => {
      const automaticallyType = form.values.automaticallyType
      const storeOutputAutomatically = field
        .query('storeOutputAutomatically')
        .get('value')
      const outputReference = field.query('outputReference').get('value')
      field.display =
        (storeOutputAutomatically === false && automaticallyType !== false) ||
        outputReference
          ? 'visible'
          : 'none'
    },
    [form.values.automaticallyType]
  )

  const reactionOutputReference = useCallback((field: any) => {
    const addressVal = field.query('address').get('value')
    const getFirstRecordOnly = field.query('getFirstRecordOnly').get('value')
    const storeOutputAutomatically = field
      .query('storeOutputAutomatically')
      .get('value')
    const automaticallyType = field.query('automaticallyType').get('value')
    const registerId = field.query('registerId').get('value')
    if (!isBool(addressVal)) {
      form.setFieldState('address', (state) => {
        state.value = true
      })
    }
    const isVisible =
      storeOutputAutomatically === false &&
      automaticallyType === false &&
      ((isBool(addressVal) && addressVal) || getFirstRecordOnly === false)
    field.display = isVisible ? 'visible' : 'none'
    field.componentProps.refRegisterId = registerId
    if (getFirstRecordOnly) {
      field.title = (
        <TextWidget>
          flowDesigner.flow.form.recordLookUp.outputReference
        </TextWidget>
      )
      field.componentProps.flowJsonTypes = [
        {
          value: FlowResourceType.VARIABLE_RECORD,
        },
      ]
      field.componentProps.placeholder = useLocale(
        'flowDesigner.flow.form.placeholder.outputReference'
      )
    } else {
      field.title = (
        <TextWidget>
          flowDesigner.flow.form.recordLookUp.outputReferenceArray
        </TextWidget>
      )
      field.componentProps.flowJsonTypes = [
        {
          value: FlowResourceType.VARIABLE_ARRAY_RECORD,
        },
      ]
      field.componentProps.placeholder = useLocale(
        'flowDesigner.flow.form.placeholder.outputReferenceArray'
      )
    }
  }, [])

  const reactionAddress = useCallback((field: any) => {
    const automaticallyType = field.query('automaticallyType').get('value')
    const getFirstRecordOnly = field.query('getFirstRecordOnly').get('value')
    field.display =
      automaticallyType === false && getFirstRecordOnly !== false
        ? 'visible'
        : 'none'
  }, [])

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
                flowDesigner.flow.form.recordLookUp.registerId
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
            type: 'void',
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
          sortOrder: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.sortOrder
              </TextWidget>
            ),
            default: null,
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.sortOrderOption.asc
                  </TextWidget>
                ),
                value: 'asc',
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.sortOrderOption.desc
                  </TextWidget>
                ),
                value: 'desc',
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.sortOrderOption.no
                  </TextWidget>
                ),
                value: null,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-reactions': {
              dependencies: ['registerId'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps != '' ? 'visible' : 'none'}}",
                },
              },
            },
          },
          sortOrderIsEmpty: {
            type: 'string',
            title: '',
            'x-decorator': 'FormItem',
            'x-component': 'TextTemplate',
            'x-component-props': {
              textTemplate: (
                <TextWidget>
                  flowDesigner.flow.form.recordLookUp.textTemplate
                </TextWidget>
              ),
              style: {
                fontSize: '12px',
                position: 'relative',
                top: '20px',
              },
            },
            'x-reactions': myReaction.bind(this, 'sortOrderIsEmpty'),
          },
          sortField: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.sortField
              </TextWidget>
            ),
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.sortOrderIsEmpty
                </TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'ResourceSelect',
            'x-reactions': myReaction.bind(this, 'sortField'),
            'x-component-props': {
              sourceMode: 'objectService',
              objectKey: 'registerId',
              metaFlow,
            },
          },
          getFirstRecordOnly: {
            type: 'boolean',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.getFirstRecordOnly
              </TextWidget>
            ),
            default: true,
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.getFirstRecordOnlyOp.first
                  </TextWidget>
                ),
                value: true,
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.getFirstRecordOnlyOp.all
                  </TextWidget>
                ),
                value: false,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
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
          storeOutputAutomatically: {
            type: 'boolean',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.storeOutputAutomatically
              </TextWidget>
            ),
            default: true,
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.storeOutputAutomaticallyOp.auto
                  </TextWidget>
                ),
                value: true,
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.storeOutputAutomaticallyOp.people
                  </TextWidget>
                ),
                value: false,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': storeOutputReaction,
          },
          automaticallyType: {
            type: 'boolean',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.automaticallyType
              </TextWidget>
            ),
            default: true,
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.automaticallyTypeOp.select
                  </TextWidget>
                ),
                value: true,
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.automaticallyTypeOp.selectPro
                  </TextWidget>
                ),
                value: false,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
            // 'x-reactions': {
            //   dependencies: ['storeOutputAutomatically'],
            //   fulfill: {
            //     schema: {
            //       'x-display': "{{$deps == 'false' ? 'visible' : 'none'}}",
            //     },
            //   },
            // },
            'x-reactions': changeTypeOp,
          },
          address: {
            type: 'boolean',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.address
              </TextWidget>
            ),
            default: true,
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.addressOption.comm
                  </TextWidget>
                ),
                value: true,
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.addressOption.one
                  </TextWidget>
                ),
                value: false,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': reactionAddress,
          },
          outputReference: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.outputReference
              </TextWidget>
            ),
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.outputReference
                </TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'ResourceSelect',
            'x-component-props': {
              placeholder: useLocale(
                'flowDesigner.flow.form.placeholder.outputReference'
              ),
              metaFlow,
              flowJsonTypes: [
                {
                  value: FlowResourceType.VARIABLE_RECORD,
                },
              ],
              style: { width: '420px' },
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': reactionOutputReference,
          },
          // web1: {
          //   type: 'void',
          //   title: '',
          //   'x-decorator': 'FormItem',
          //   'x-reactions': {
          //     dependencies: ['address'],
          //     fulfill: {
          //       schema: {
          //         'x-display': "{{$deps == 'true' ? 'visible' : 'none'}}",
          //       },
          //     },
          //   },
          // },
          queriedFields: {
            type: 'array',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.queriedFields
              </TextWidget>
            ),
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.queriedFields
                </TextWidget>
              ),
            },
            required: true,
            items: {
              type: 'object',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    field: {
                      type: 'string',
                      title: '',
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-reactions': reactionField.bind(this, 'queriedFields'),
                      'x-component-props': {
                        style: {
                          width: 350,
                        },
                      },
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.addField
                  </TextWidget>
                ),
                'x-component': 'ArrayItems.Addition',
              },
            },
            'x-visible': false,
            // 'x-reactions': reactionQueriedFields,
          },
          outputAssignments: {
            type: 'array',
            required: true,
            'x-reactions': {
              dependencies: ['address'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps == 'false' ? 'visible' : 'none'}}",
                },
              },
            },
            title: (
              <TextWidget>
                flowDesigner.flow.form.recordLookUp.outputAssignments
              </TextWidget>
            ),
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.outputAssignments
                </TextWidget>
              ),
            },
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
                      'x-component': 'ArrowRightOutlinedIcon',
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
                    flowDesigner.flow.form.recordLookUp.addField
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
          assignNullValuesIfNoRecordsFound: {
            type: 'boolean',
            title: '',
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.recordLookUp.assignNullValuesIfNoRecordsFound
                  </TextWidget>
                ),
                value: true,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': {
              dependencies: ['automaticallyType'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps == 'false' ? 'visible' : 'none'}}",
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
