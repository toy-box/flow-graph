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
  DatePicker,
  NumberPicker,
  Checkbox,
  ArrayTable,
  PreviewText,
  Form,
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import { ResourceSelect, OperationSelect } from '../components/formily'
import { TextWidget, useLocale } from '@toy-box/studio-base'
import {
  convertHttpFormilyToJson,
  convertMetaToFormily,
  keyValueToObjArray,
  objArrayToKeyValue,
} from '@toy-box/action-template'
import { MetaValueType } from '@toy-box/meta-schema'

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
    ArrayTabs,
    ArrayItems,
    FormItem,
    NumberPicker,
    FormGrid,
    Input,
    Select,
    Radio,
    descTipHtml,
    BranchArrays,
    ResourceSelect,
    OperationSelect,
    DatePicker,
    Checkbox,
    ArrayTable,
    PreviewText,
    AssignmentDesc,
  },
})

export const commSchema = {
  grid: {
    type: 'void',
    'x-component': 'FormGrid',
    'x-component-props': {
      maxColumns: 2,
    },
    properties: {
      shorcutName: {
        type: 'string',
        title: 'shorcutName',
        'x-decorator': 'FormItem',
        'x-component': 'PreviewText.Input',
        'x-decorator-props': {
          // layout: 'vertical',
          // colon: false,
          // gridSpan: 2,
          feedbackLayout: 'terse',
        },
      },
      shortcutId: {
        type: 'string',
        title: 'shortcutId',
        'x-decorator': 'FormItem',
        'x-component': 'PreviewText.Input',
        'x-decorator-props': {
          // layout: 'vertical',
          // colon: false,
          // gridSpan: 2,
          feedbackLayout: 'terse',
        },
      },
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
              <TextWidget>flowDesigner.flow.form.validator.required</TextWidget>
            ),
          },
        ],
      },
      id: {
        type: 'string',
        title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
        required: true,
        'x-disabled': false,
        'x-validator': [
          {
            triggerType: 'onBlur',
            required: false,
            message: (
              <TextWidget>flowDesigner.flow.form.validator.value</TextWidget>
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
        'x-component': () => {
          return <Divider className="margin-0" />
        },
        'x-decorator-props': {
          gridSpan: 2,
          feedbackLayout: 'terse',
        },
      },
    },
  },
}

export const variableOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const isEdit = !node.make
  const { name, id, description, title: shortcutIdMake } = node
  const shortcutId = shortcutIdMake ?? node.shortcutId
  const metaFlowShortcut = node.metaFlow.shortcutData.find(
    (shortcut) => shortcut.id === shortcutId
  )
  const shorcutName = metaFlowShortcut.name
  const shortcutJson = node?.shortcutJson ?? metaFlowShortcut
  const variable = node?.variable ?? shortcutJson.variable
  const title = !isEdit ? (
    <TextWidget>flowDesigner.flow.form.variable.addTitle</TextWidget>
  ) : (
    <TextWidget>flowDesigner.flow.form.variable.editTitle</TextWidget>
  )
  commSchema.grid.properties.id['x-disabled'] = isEdit
  const schema = convertMetaToFormily(variable, commSchema)
  const dialog = FormDialog(
    {
      title: title,
      width: '90vw',
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={schema} />
        </FormLayout>
      )
    }
  )
  dialog
    .forOpen((payload, next) => {
      node?.shortcutJson &&
        variable
          .filter(({ type }) => type === MetaValueType.OBJECT)
          .map(({ key }) => {
            shortcutJson.variable[key] = keyValueToObjArray(
              shortcutJson.variable[key]
            )
          })

      setTimeout(() => {
        next({
          initialValues: node?.shortcutJson
            ? {
                shortcutId,
                shorcutName,
                name,
                id,
                description,
                ...shortcutJson.variable,
              }
            : { shortcutId, shorcutName, name: 'shortcut node' },
        })
      }, 500)
    })
    .forConfirm((payload, next) => {
      const { name, id, description, shortcutId, shorcutName, ...rest } =
        payload.values
      setTimeout(() => {
        variable
          .filter(({ type }) => type === MetaValueType.OBJECT)
          .map(({ key }) => {
            rest[key] = objArrayToKeyValue(rest[key])
          })
        const paramData = {
          shortcutId,
          name,
          id,
          description,
          variable,
          shortcutJson: {
            ...shortcutJson,
            variable: rest,
          },
        }
        node.make
          ? node.make(at, { ...additionInfo, ...paramData })
          : node.update(paramData)
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
