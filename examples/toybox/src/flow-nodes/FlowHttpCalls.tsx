import React from 'react'
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
} from '@formily/antd'
import { createSchemaField } from '@formily/react'
import * as ICONS from '@ant-design/icons'
import { FlowMetaNode, FlowMetaType, FreeFlow } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { useLocale } from '../hooks'
import { ResourceSelect, OperationSelect } from '../components/formily'
import { TextWidget, takeMessage } from '../widgets'

import './flowNodes.less'

const AssignmentDesc = () => {
  return (
    <div>
      <Divider className="margin-0" />
      {/* <div className="assignment-content">
        <div className="assignment-title connectDialog-title">
          <TextWidget>flowDesigner.flow.form.assignment.setVariable</TextWidget>
        </div>
        <div className="assignment-desc">
          <TextWidget>flowDesigner.flow.form.assignment.tip</TextWidget>
        </div>
      </div> */}
    </div>
  )
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    ArrayItems,
    Input,
    Select,
    FormTab,
    AssignmentDesc,
    ResourceSelect,
    OperationSelect,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name])
    },
  },
})

const httpCallsRender = (isNew: boolean, metaFlow: FreeFlow) => {
  const httpCallsSchema = {
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
                  <TextWidget>
                    flowDesigner.flow.form.validator.required
                  </TextWidget>
                ),
              },
            ],
          },
          id: {
            type: 'string',
            title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
            required: true,
            'x-disabled': !isNew,
            'x-validator': [
              {
                triggerType: 'onBlur',
                required: false,
                message: (
                  <TextWidget>
                    flowDesigner.flow.form.validator.value
                  </TextWidget>
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
            'x-component': 'AssignmentDesc',
            'x-decorator-props': {
              gridSpan: 2,
              feedbackLayout: 'terse',
            },
          },
          callArguments: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                title: (
                  <TextWidget token="flowDesigner.flow.form.httpCalls.urlTitle"></TextWidget>
                ),
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  layout: 'vertical',
                  colon: false,
                  gridSpan: 2,
                },
                'x-component': 'Input',
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
              method: {
                type: 'string',
                title: (
                  <TextWidget token="flowDesigner.flow.form.httpCalls.methodTitle"></TextWidget>
                ),
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  layout: 'vertical',
                  colon: false,
                },
                'x-component': 'Select',
                enum: [
                  {
                    label: 'GET',
                    value: 'GET',
                  },
                  {
                    label: 'POST',
                    value: 'POST',
                  },
                  {
                    label: 'PUT',
                    value: 'PUT',
                  },
                  {
                    label: 'DELETE',
                    value: 'DELETE',
                  },
                  {
                    label: 'HEAD',
                    value: 'HEAD',
                  },
                  {
                    label: 'OPTIONS',
                    value: 'OPTIONS',
                  },
                  {
                    label: 'PATCH',
                    value: 'PATCH',
                  },
                  {
                    label: 'CONNECT',
                    value: 'CONNECT',
                  },
                  {
                    label: 'TRACE',
                    value: 'TRACE',
                  },
                ],
              },
              contentType: {
                type: 'string',
                title: (
                  <TextWidget token="flowDesigner.flow.form.httpCalls.contentTypeTitle"></TextWidget>
                ),
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  layout: 'vertical',
                  colon: false,
                },
                'x-component': 'Select',
                enum: [
                  {
                    label: 'application/json',
                    value: 'application/json',
                  },
                  {
                    label: 'application/xml',
                    value: 'application/xml',
                  },
                  {
                    label: 'application/x-www-form-urlencoded',
                    value: 'application/x-www-form-urlencoded',
                  },
                  {
                    label: 'text/plain',
                    value: 'text/plain',
                  },
                  {
                    label: 'text/html',
                    value: 'text/html',
                  },
                ],
              },
              pathParameters: {
                type: 'string',
              },
              queryParameters: {
                type: 'object',
              },
              cookies: {
                type: 'object',
              },
              headers: {
                type: 'object',
              },
              form: {
                type: 'object',
              },
              body: {
                anyOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'object' },
                ],
              },
              authorization: {
                type: 'object',
                default: {},
                title: 'The Authorizetion Schema',
                properties: {
                  type: {
                    type: 'string',
                  },
                  username: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                  token: {
                    type: 'string',
                  },
                },
              },
              result: {
                anyOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'object' },
                  { type: 'array' },
                ],
              },
            },
          },
        },
      },
    },
  }
  const getToken = isNew
    ? 'flowDesigner.flow.form.httpCalls.addTitle'
    : 'flowDesigner.flow.form.httpCalls.editTitle'
  return FormDialog(
    {
      title: <TextWidget>{getToken}</TextWidget>,
      width: '60vw',
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={httpCallsSchema} />
        </FormLayout>
      )
    }
  )
}

export const httpCallsOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = httpCallsRender(node.make, node.metaFlow)
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            assignmentItems: node.assignmentItems ?? [
              { operation: undefined, type: undefined, value: undefined },
            ],
            id: node.id,
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
