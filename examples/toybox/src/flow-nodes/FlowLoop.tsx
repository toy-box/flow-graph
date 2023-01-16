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
import * as ICONS from '@ant-design/icons'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'
import { INodeTemplate, NodeMake } from '@toy-box/flow-node'
import { TextWidget, takeMessage } from '../widgets'

const LoopDescrip = () => {
  return (
    <div>
      <TextWidget>flowDesigner.flow.form.loop.loopDescrip</TextWidget>
    </div>
  )
}

const SchemaField = createSchemaField({
  components: {
    LoopDescrip,
    ArrayTabs,
    ArrayItems,
    FormItem,
    FormGrid,
    Input,
    Select,
    Radio,
    Divider,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name])
    },
  },
})

const loopPanelSchema = {
  type: 'object',
  properties: {
    loopDescrip: {
      type: 'string',
      title: '',
      'x-decorator': 'FormItem',
      'x-component': 'LoopDescrip',
      'x-decorator-props': {
        feedbackLayout: 'terse',
      },
    },
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
          },
          'x-component': 'Input',
        },
        id: {
          type: 'string',
          title: <TextWidget>flowDesigner.flow.form.comm.value</TextWidget>,
          required: false,
          'x-validator': [
            {
              triggerType: 'onBlur',
              // required: true,
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
          'x-component-props': {
            disabled: true,
          },
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
      },
    },
    titleCollection: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        feedbackLayout: 'terse',
      },
      'x-component': () => {
        return (
          <>
            <Divider className="margin-0" />
            <div className="connectDialog-title marginTB-5">
              <TextWidget token="flowDesigner.flow.form.loop.titleCollection" />
            </div>
          </>
        )
      },
    },
    collectionReference: {
      type: 'string',
      title: (
        <TextWidget token="flowDesigner.flow.form.loop.collectionReference" />
      ),
      required: true,
      'x-validator': [
        {
          triggerType: 'onBlur',
          required: false,
          message: (
            <TextWidget>flowDesigner.flow.form.validator.required</TextWidget>
          ),
        },
      ],
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        layout: 'vertical',
        colon: false,
        wrapperWidth: 350,
        feedbackLayout: 'terse',
      },
      'x-component': 'Input',
      'x-component-props': {
        suffix: "{{icon('SearchOutlined')}}",
        placeholder: takeMessage('flowDesigner.flow.form.comm.collectionPlace'),
      },
    },
    titleDirection: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        feedbackLayout: 'terse',
      },
      'x-component': () => {
        return (
          <>
            <Divider className="margin-0" />
            <div className="connectDialog-title marginTB-5">
              <TextWidget token="flowDesigner.flow.form.loop.titleDirection" />
            </div>
          </>
        )
      },
    },
    iterationOrder: {
      type: 'number',
      title: 'Direction',
      enum: [
        {
          label: (
            <TextWidget token="flowDesigner.flow.form.loop.iterationPositive" />
          ),
          value: 1,
        },
        {
          label: (
            <TextWidget token="flowDesigner.flow.form.loop.iterationReverse" />
          ),
          value: 2,
        },
      ],
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        layout: 'vertical',
        colon: false,
        // wrapperWidth: 350,
        feedbackLayout: 'terse',
      },
      required: true,
      'x-validator': [
        {
          triggerType: 'onBlur',
          required: false,
          message: (
            <TextWidget>flowDesigner.flow.form.validator.required</TextWidget>
          ),
        },
      ],
      'x-component': 'Radio.Group',
      'x-component-props': {
        layout: 'vertical',
      },
    },
    // titleLoop: {
    //   type: 'void',
    //   'x-decorator': 'FormItem',
    //   'x-component': () => {
    //     return (
    //       <>
    //         <Divider />
    //         <TextWidget token="flowDesigner.flow.form.loop.titleLoop" />
    //       </>
    //     )
    //   },
    // },
    // loopVariable: {
    //   type: 'string',
    //   title: <TextWidget token="flowDesigner.flow.form.loop.loopVariable" />,
    //   required: true,
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    // },
  },
}

const loopRender = (isNew: boolean) => {
  const getToken = isNew
    ? 'flowDesigner.flow.form.loop.addTitle'
    : 'flowDesigner.flow.form.loop.editTitle'
  return FormDialog(
    {
      title: <TextWidget>{getToken}</TextWidget>,
      width: '90vw',
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <SchemaField schema={loopPanelSchema} />
        </FormLayout>
      )
    }
  )
}

export const loopOnEdit = (node: any, at?: string, additionInfo?: any) => {
  const dialog = loopRender(node.make)
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({
          initialValues: {
            name: node.type,
            description: node.description,
            collectionReference: node.collectionReference,
            iterationOrder: node.iterationOrder,
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
