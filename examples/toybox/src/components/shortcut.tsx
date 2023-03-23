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
  MetaFlow,
} from '@toy-box/autoflow-core'
import { MetaValueType } from '@toy-box/meta-schema'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
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

// import './flowNodes.less'
import {
  AutoFlow,
  httpCallsSchema,
  AssignmentDesc,
} from '@toy-box/flow-designable'

const shortcutSchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 6,
      },
      properties: {
        grid: {
          ...httpCallsSchema.properties.grid,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 4,
            feedbackLayout: 'terse',
          },
        },
        // divider:{
        //   type: 'void',
        //   'x-component': ()=><Divider type="vertical" />,
        //   'x-decorator': 'FormItem',
        //   'x-decorator-props': {
        //     gridSpan: 1,
        //     feedbackLayout: 'terse',
        //   },
        // },
        variable: {
          type: 'array',
          title: (
            <TextWidget token="flowDesigner.shortcut.variable"></TextWidget>
          ),
          required: true,
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            gridSpan: 2,
            layout: 'vertical',
            colon: false,
            style: {
              borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
              paddingLeft: '8px',
            },
          },
          'x-component': 'ArrayItems',
          items: {
            type: 'object',
            properties: {
              space: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                  sort: {
                    type: 'void',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayItems.SortHandle',
                  },
                  key: {
                    type: 'string',
                    title: (
                      <TextWidget token="flowDesigner.flow.form.comm.arrayTableKey"></TextWidget>
                    ),
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      layout: 'vertical',
                      colon: false,
                    },
                    'x-component': 'Input',
                    // 'x-component-props': {
                    //   style: {
                    //     width: 160,
                    //   },
                    // },
                  },
                  type: {
                    type: 'string',
                    title: (
                      <TextWidget token="flowDesigner.flow.form.comm.arrayTableType"></TextWidget>
                    ),
                    // enum: MetaValueType,
                    enum: [
                      // { label: MetaValueType.INTEGER, value: MetaValueType.INTEGER, disabled: false },
                      {
                        label: (
                          <TextWidget token="flowDesigner.shortcut.enumNumber"></TextWidget>
                        ),
                        value: MetaValueType.NUMBER,
                        disabled: false,
                      },
                      {
                        label: (
                          <TextWidget token="flowDesigner.shortcut.enumString"></TextWidget>
                        ),
                        value: MetaValueType.STRING,
                        disabled: false,
                      },
                      // { label: MetaValueType.TEXT, value: MetaValueType.TEXT, disabled: false },
                      {
                        label: (
                          <TextWidget token="flowDesigner.shortcut.enumDate"></TextWidget>
                        ),
                        value: MetaValueType.DATE,
                        disabled: false,
                      },
                      {
                        label: (
                          <TextWidget token="flowDesigner.shortcut.enumDateTime"></TextWidget>
                        ),
                        value: MetaValueType.DATETIME,
                        disabled: false,
                      },
                      {
                        label: (
                          <TextWidget token="flowDesigner.shortcut.enumBoolean"></TextWidget>
                        ),
                        value: MetaValueType.BOOLEAN,
                        disabled: false,
                      },
                      // { label: MetaValueType.ARRAY, value: MetaValueType.ARRAY, disabled: false },
                      // { label: MetaValueType.OBJECT_ID, value: MetaValueType.OBJECT_ID, disabled: false },
                      // { label: MetaValueType.SINGLE_OPTION, value: MetaValueType.SINGLE_OPTION, disabled: false },
                      // { label: MetaValueType.MULTI_OPTION, value: MetaValueType.MULTI_OPTION, disabled: false },
                      // { label: MetaValueType.PERCENT, value: MetaValueType.PERCENT, disabled: false },
                      {
                        label: (
                          <TextWidget token="flowDesigner.shortcut.enumObject"></TextWidget>
                        ),
                        value: MetaValueType.OBJECT,
                        disabled: false,
                      },
                      // { label: MetaValueType.RATE, value: MetaValueType.RATE, disabled: false },
                      // { label: MetaValueType.TIMESTAMP, value: MetaValueType.TIMESTAMP, disabled: false },
                      // { label: MetaValueType.BIG_INT, value: MetaValueType.BIG_INT, disabled: false },
                      // { label: MetaValueType.BIG_NUMBER, value: MetaValueType.BIG_NUMBER, disabled: false },
                      // { label: MetaValueType.ADDRESS, value: MetaValueType.ADDRESS, disabled: false },
                    ],
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      layout: 'vertical',
                      colon: false,
                    },
                    'x-component': 'Select',
                    'x-component-props': {
                      style: {
                        width: 160,
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
                <TextWidget token="flowDesigner.flow.form.comm.arrayTableAdd"></TextWidget>
              ),
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
      },
    },
  },
}

export const shortcutOnEdit = (
  metaflow: AutoFlow,
  shortcutJson?: any,
  setActiveKey?: any
) => {
  const isEdit = false
  let formDialog = null
  const onCancel = () => {
    formDialog.close()
  }
  const onSubmit = (form) => {
    const paramData = convertHttpFormilyToJson(form.values)
    metaflow.shortcutPush(paramData)
    setActiveKey(false)
    formDialog.close()
  }
  const title = !isEdit ? (
    <TextWidget>flowDesigner.shortcut.addTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.shortcut.editTitle</TextWidget>
  )
  // httpCallsSchema.properties.grid.properties.id['x-disabled'] = isEdit

  formDialog = FormDialog(
    {
      title: title,
      footer: null,
      open: false,
      width: '90vw',
    },
    <Shortcut
      value={shortcutJson}
      // metaflow={metaFlow}
      isEdit={isEdit}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
  formDialog
    .forOpen((payload, next) => {
      next({})
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        next(payload)
      }, 0)
    })
    .forCancel((payload, next) => {
      setTimeout(() => {
        setActiveKey(false)
        next(payload)
      }, 0)
    })
    .open()
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
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name])
    },
  },
})

export interface ShortcutModelPorps {
  value?: FlowMetaParam
  // metaFlow: AutoFlow
  onCancel: () => void
  onSubmit: (from) => void
  isEdit: boolean
}

export const Shortcut: FC<ShortcutModelPorps> = ({
  value,
  onCancel,
  onSubmit,
  // metaFlow,
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

  formTab.setActiveKey('tab1')

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
  }

  return (
    <>
      <FormLayout layout="vertical" colon={false}>
        <FormProvider form={form}>
          <SchemaField schema={shortcutSchema} scope={{ formTab }} />
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
