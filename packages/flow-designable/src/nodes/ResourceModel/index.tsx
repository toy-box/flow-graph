import React, { FC, useCallback, useState } from 'react'
import {
  FormItem,
  FormLayout,
  Input,
  Select,
  Checkbox,
  FormGrid,
  FormDialog,
  FormButtonGroup,
  Submit,
  IFormDialog,
} from '@formily/antd'
import {
  createForm,
  onFieldReact,
  onFieldValueChange,
  FormPathPattern,
  Field,
} from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
import { Button, Modal } from 'antd'
import { action } from '@formily/reactive'
import {
  MetaValueType,
  ICompareOperation,
  IFieldMeta,
} from '@toy-box/meta-schema'
import { clone } from '@formily/shared'
import { FlowResourceType, IFieldMetaFlow } from '@toy-box/autoflow-core'
// import { RepeatErrorMessage } from './RepeatErrorMessage'
import { GatherInput, FormulaEditor } from '../../components/formily'
// import { FormulaEditor, BraftEditorTemplate } from '../formily'
import { useLocale, TextWidget } from '@toy-box/studio-base'
import { AutoFlow } from '../../interface'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    GatherInput,
    FormulaEditor,
    // BraftEditorTemplate,
    Checkbox,
    FormGrid,
  },
})

const metaDataOps = [
  {
    value: MetaValueType.STRING,
    label: <TextWidget>flowDesigner.flow.metaType.str</TextWidget>,
  },
  {
    value: MetaValueType.NUMBER,
    label: <TextWidget>flowDesigner.flow.metaType.num</TextWidget>,
  },
  {
    value: MetaValueType.OBJECT,
    label: <TextWidget>flowDesigner.flow.metaType.objectId</TextWidget>,
  },
  {
    value: MetaValueType.TEXT,
    label: <TextWidget>flowDesigner.flow.metaType.text</TextWidget>,
  },
  {
    value: MetaValueType.BOOLEAN,
    label: <TextWidget>flowDesigner.flow.metaType.bool</TextWidget>,
  },
  {
    value: MetaValueType.DATE,
    label: <TextWidget>flowDesigner.flow.metaType.date</TextWidget>,
  },
  {
    value: MetaValueType.DATETIME,
    label: <TextWidget>flowDesigner.flow.metaType.dateTime</TextWidget>,
  },
]

const constMetaOps = [
  MetaValueType.TEXT,
  MetaValueType.STRING,
  MetaValueType.NUMBER,
  MetaValueType.BOOLEAN,
  MetaValueType.DATE,
]

const formulaMetaOps = [
  MetaValueType.TEXT,
  MetaValueType.STRING,
  MetaValueType.NUMBER,
  MetaValueType.BOOLEAN,
  MetaValueType.DATE,
  MetaValueType.DATETIME,
]

const labelNames: any = {
  [FlowResourceType.VARIABLE]: (
    <TextWidget>flowDesigner.flow.autoFlow.variable</TextWidget>
  ),
  [FlowResourceType.VARIABLE_ARRAY]: (
    <TextWidget>flowDesigner.flow.autoFlow.variableArray</TextWidget>
  ),
  [FlowResourceType.VARIABLE_ARRAY_RECORD]: (
    <TextWidget>flowDesigner.flow.autoFlow.variableArrayRecord</TextWidget>
  ),
  [FlowResourceType.CONSTANT]: (
    <TextWidget>flowDesigner.flow.autoFlow.constant</TextWidget>
  ),
  [FlowResourceType.FORMULA]: (
    <TextWidget>flowDesigner.flow.autoFlow.formula</TextWidget>
  ),
  [FlowResourceType.TEMPLATE]: (
    <TextWidget>flowDesigner.flow.autoFlow.template</TextWidget>
  ),
}

const handleOk = (values, metaflow: AutoFlow, isEdit: boolean) => {
  const obj: any = values
  const resourceData: any = {
    description: obj.description,
    exclusiveMaximum: null,
    exclusiveMinimum: null,
    format: null,
    key: obj.key,
    maxLength: null,
    maximum: null,
    minLength: null,
    minimum: null,
    name: obj.key,
    options: null,
    pattern: null,
    primary: null,
    properties: null,
    required: null,
    type: obj.type,
    defaultValue: obj.defaultValue,
    refObjectId: obj.refObjectId,
    text: obj.text,
    calcType: obj.formula ? 'formula' : undefined,
    formula: obj.formula,
    webType: obj.flowType,
  }
  // const register = flowGraph.registers.find(
  //   (reg) => reg.id === obj.refObjectId
  // )
  // if (obj.refObjectId && obj.type === MetaValueType.OBJECT) {
  //   resourceData.refRegisterId = register?.id
  // }
  const valueTypeLen = obj.valueType ? obj.valueType.length : undefined
  if (valueTypeLen) {
    resourceData.type = MetaValueType.ARRAY
    resourceData.items = {
      type: obj.type,
      properties: undefined,
    }
  }
  // if (valueTypeLen) {
  //   resourceData.type = MetaValueType.ARRAY
  //   resourceData.items = {
  //     type: obj.type,
  //     properties: register?.properties,
  //   }
  // } else if (obj.refObjectId && obj.type === MetaValueType.OBJECT) {
  //   resourceData.properties = register?.properties
  // }
  const flowDataType = obj.flowType
  if (flowDataType === FlowResourceType.VARIABLE) {
    resourceData.isInput = obj.paramLabel?.includes('isInput') ?? true
    resourceData.isOutPut = obj.paramLabel?.includes('isOutPut') ?? true
  }
  if (isEdit) {
    metaflow.editResource(flowDataType, resourceData)
  } else {
    metaflow.createResource(flowDataType, resourceData)
  }
}

export const resourceEdit = (
  metaFlow: AutoFlow,
  isEdit: boolean,
  value?: IFieldMetaFlow,
  fieldType?: string
) => {
  let formDialog = null
  const onCancel = () => {
    formDialog.close()
  }
  const onSubmit = (from) => {
    handleOk(from.values, metaFlow, isEdit)
    formDialog.close()
  }
  const title = !isEdit ? (
    <TextWidget>flowDesigner.flow.form.resourceCreate.createTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.flow.form.resourceCreate.editTitle</TextWidget>
  )
  formDialog = FormDialog(
    {
      title: title,
      footer: null,
      //   visible: visible,
      open: false,
      width: '60vw',
      // width: 980,
    },
    <ResourceCreate
      isEdit={isEdit}
      metaFlow={metaFlow}
      fieldType={fieldType}
      value={value}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
  // .forOpen((payload, next) => {
  //     debugger
  //   next({
  //     initialValues: value,
  //   })
  // })
  // .forConfirm((payload, next) => {
  //     setTimeout(() => {
  //         console.log('assign payload', payload.values)
  //         debugger
  //         handleOk(payload.values, metaflow)
  //         next(payload)
  //       }, 500)
  // })
  // .open()
  // .then(console.log)
  formDialog
    .forOpen((payload, next) => {
      next({})
    })
    .open()
}

interface ResourceCreateProps {
  //   fieldMetas?: ICompareOperation[]
  metaFlow: AutoFlow
  isEdit?: boolean
  //   title?: string | JSX.Element
  value?: IFieldMetaFlow
  fieldType?: string
  onCancel: () => void
  onSubmit: (from) => void
}

export const ResourceCreate: FC<ResourceCreateProps> = ({
  //   fieldMetas = [],
  metaFlow,
  isEdit,
  value,
  fieldType,
  onCancel,
  onSubmit,
}) => {
  const useAsyncDataSource = (
    pattern: FormPathPattern,
    service: (field: Field) => any
  ) => {
    onFieldReact(pattern, (field) => {
      const fieldObj = field as any
      fieldObj.loading = true
      const flowTypeValue = field.query('flowType').value()
      const isShow =
        flowTypeValue && flowTypeValue !== FlowResourceType.TEMPLATE
      const isShowDefault =
        flowTypeValue === FlowResourceType.VARIABLE ||
        flowTypeValue === FlowResourceType.CONSTANT
      field.display = isShow ? 'visible' : 'none'
      const valueTypeArray = field.query('valueType').value()
      const valueType = valueTypeArray ? valueTypeArray.length : undefined
      formData.setFieldState('defaultValue', (state) => {
        const valFlag =
          !valueType &&
          fieldObj.value &&
          fieldObj.value !== MetaValueType.MULTI_OPTION &&
          fieldObj.value !== MetaValueType.SINGLE_OPTION &&
          fieldObj.value !== MetaValueType.OBJECT
        state.display = isShowDefault && valFlag ? 'visible' : 'none'
      })
      service(fieldObj).then(
        action(() => {
          // fieldObj.dataSource = data
          fieldObj.inputValue = null
          fieldObj.loading = false
        })
      )
    })
  }

  const formData = createForm({
    effects: () => {
      onFieldValueChange('flowType', (field) => {
        formData.setFieldState('type', (state) => {
          state.value = null
        })
        formData.setFieldState('text', (state) => {
          state.display =
            field.value === FlowResourceType.TEMPLATE ? 'visible' : 'none'
        })
      })
      useAsyncDataSource('type', async (field) => {
        const flowType = field.query('flowType').get('value')
        if (!flowType) return (field.dataSource = [])
        return new Promise((resolve) => {
          switch (flowType) {
            case FlowResourceType.VARIABLE:
              field.dataSource = metaDataOps
              return resolve(metaDataOps)
            case FlowResourceType.CONSTANT: {
              const ops = constMetaOps.map((op) => {
                return metaDataOps.find((metaData) => metaData.value === op)
              })
              field.dataSource = ops as any[]
              return resolve(ops as any[])
            }
            case FlowResourceType.FORMULA: {
              const Fops = formulaMetaOps.map((op) => {
                return metaDataOps.find((metaData) => metaData.value === op)
              })
              field.dataSource = Fops as any[]
              return resolve(Fops as any[])
            }
            default:
              field.dataSource = []
              return resolve([])
          }
        })
      })
      onFieldValueChange('type', (field) => {
        formData.setFieldState('formula', (state) => {
          const flowType = field.query('flowType').get('value')
          state.display =
            flowType === FlowResourceType.FORMULA && field.value
              ? 'visible'
              : 'none'
        })
        formData.setFieldState('defaultValue', (state) => {
          state.value = null
        })
      })
    },
  })

  if (value) {
    const flowDataVal = clone(value)
    switch (fieldType) {
      case FlowResourceType.VARIABLE_ARRAY:
      case FlowResourceType.VARIABLE_ARRAY_RECORD:
        flowDataVal.flowType = FlowResourceType.VARIABLE
        flowDataVal.valueType = 'array'
        flowDataVal.type = value?.items?.type
        break
      case FlowResourceType.VARIABLE_RECORD:
        flowDataVal.flowType = FlowResourceType.VARIABLE
        break
      default:
        flowDataVal.flowType = fieldType
        break
    }
    const arr = []
    if (flowDataVal?.isInput) arr?.push('isInput')
    if (flowDataVal?.isOutPut) arr?.push('isOutPut')
    flowDataVal.paramLabel = arr
    formData.setValues(flowDataVal)
  }

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
          flowType: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.flowType
              </TextWidget>
            ),
            'x-disabled': isEdit,
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.flowType
                </TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              {
                label: labelNames[FlowResourceType.VARIABLE],
                value: FlowResourceType.VARIABLE,
              },
              {
                label: labelNames[FlowResourceType.CONSTANT],
                value: FlowResourceType.CONSTANT,
              },
              {
                label: labelNames[FlowResourceType.FORMULA],
                value: FlowResourceType.FORMULA,
              },
              //   {
              //     label: labelNames[FlowResourceType.TEMPLATE],
              //     value: FlowResourceType.TEMPLATE,
              //   },
            ],
            'x-component-props': {
              // placeholder: (
              //   <TextWidget>
              //     flowDesigner.flow.form.placeholder.flowType
              //   </TextWidget>
              // ),
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          key: {
            type: 'string',
            title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
            required: true,
            // 'x-disabled': !!value,
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
              //   {
              //     triggerType: 'onBlur',
              //     validator: (val: string) => {
              //       if (!val) return null
              //       const message = new RepeatErrorMessage(
              //         flowGraph,
              //         val,
              //         value,
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
            'x-component-props': {
              // placeholder: useLocale('flowDesigner.flow.form.placeholder.name'),
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          description: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.description
              </TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              // placeholder: useLocale(
              //   'flowDesigner.flow.form.placeholder.description'
              // ),
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          type: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.type
              </TextWidget>
            ),
            required: true,
            'x-disabled': isEdit,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>flowDesigner.flow.form.validator.type</TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              // placeholder: (
              //   <TextWidget>flowDesigner.flow.form.placeholder.type</TextWidget>
              // ),
            },
          },
          valueType: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.valueType
              </TextWidget>
            ),
            'x-disabled': isEdit,
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.resourceCreate.valueTypeOption.array
                  </TextWidget>
                ),
                value: 'array',
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            'x-reactions': {
              dependencies: ['flowType'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps == 'variables' ? 'visible' : 'none'}}",
                },
              },
            },
          },
          refObjectId: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.refObjectId
              </TextWidget>
            ),
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.refObjectId
                </TextWidget>
              ),
            },
            'x-decorator': 'FormItem',
            'x-component': 'GatherInput',
            'x-component-props': {
              // placeholder: (
              //   <TextWidget>
              //     flowDesigner.flow.form.placeholder.refObjectId
              //   </TextWidget>
              // ),
              //   flowGraph,
              disabled: isEdit,
              sourceMode: 'objectService',
              rank: 'single',
              metaFlow,
              style: {
                with: '220px',
              },
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-reactions': {
              dependencies: ['type'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps == 'object' ? 'visible' : 'none'}}",
                },
              },
            },
          },
          defaultValue: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.defaultValue
              </TextWidget>
            ),
            'x-decorator': 'FormItem',
            'x-component': 'GatherInput',
            'x-component-props': {
              metaFlow,
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          //   text: {
          //     type: 'string',
          //     title: (
          //       <TextWidget>
          //         flowDesigner.flow.form.resourceCreate.text
          //       </TextWidget>
          //     ),
          //     required: true,
          //     'x-disabled': true,
          //     'x-validator': {
          //       required: true,
          //       message: (
          //         <TextWidget>flowDesigner.flow.form.validator.text</TextWidget>
          //       ),
          //     },
          //     'x-visible': false,
          //     'x-decorator': 'FormItem',
          //     'x-component': 'BraftEditorTemplate',
          //     'x-component-props': {},
          //     'x-decorator-props': {
          //       gridSpan: 2,
          //     },
          //   },
          paramLabel: {
            type: 'array',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.paramLabel
              </TextWidget>
            ),
            enum: [
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.resourceCreate.isInput
                  </TextWidget>
                ),
                value: 'isInput',
              },
              {
                label: (
                  <TextWidget>
                    flowDesigner.flow.form.resourceCreate.isOutPut
                  </TextWidget>
                ),
                value: 'isOutPut',
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            'x-reactions': {
              dependencies: ['flowType'],
              fulfill: {
                schema: {
                  'x-display': "{{$deps == 'variables' ? 'visible' : 'none'}}",
                },
              },
            },
          },
          formula: {
            type: 'string',
            title: (
              <TextWidget>
                flowDesigner.flow.form.resourceCreate.expression
              </TextWidget>
            ),
            required: true,
            'x-validator': {
              required: true,
              message: (
                <TextWidget>
                  flowDesigner.flow.form.validator.expression
                </TextWidget>
              ),
            },
            'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'FormulaEditor',
            'x-component-props': {
              metaFlow,
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
        },
      },
    },
  }

  const [form, setForm] = useState(formData)

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
