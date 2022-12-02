import { FormDialog, FormItem, FormLayout, Select } from '@formily/antd'
import { createSchemaField } from '@formily/react'
import React from 'react'
import { ICanvas } from '@toy-box/flow-graph'
import { Connection, addEdge } from 'reactflow'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Select,
  },
})
const decisonConnectSchema = {
  type: 'object',
  properties: {
    decisionResult: {
      type: 'string',
      title: '结果',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
    },
  },
}

const loopConnectSchema = {
  type: 'object',
  properties: {
    loopResult: {
      type: 'string',
      title: '结果',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          label: 'For each item in the collection',
          value: 'For Each Item',
        },
        {
          label: 'After Last item in the collection',
          value: 'After Last Item',
        },
      ],
    },
  },
}

export const decisonConnectDialog = (
  targetNode: string,
  connection: Connection,
  canvas: ICanvas,
  loadData?: any,
  sourceFlowmetaNode?: FlowMetaNode
) => {
  const useAsyncDataSource = (loadData) => (field) => {
    field.dataSource = loadData
    field.data = loadData[0].value
  }
  const dialog = FormDialog('选择决策连接器的结果', () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <div>要转到&quot;{targetNode}&quot; 元素，必须满足哪些结果条件？</div>
        <SchemaField
          schema={decisonConnectSchema}
          scope={{ useAsyncDataSource, loadData }}
        />
      </FormLayout>
    )
  })
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({})
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        const newEdge = {
          ...connection,
          label: payload.values.decisionResult,
        }
        canvas.edges = addEdge(newEdge, canvas.edges)
        if (payload.values.decisionResult === 'default') {
          sourceFlowmetaNode.updateConnector(
            connection.target,
            'defaultConnector'
          )
        } else {
          const Index = sourceFlowmetaNode.rules.findIndex(
            ({ name }) => name === payload.values.decisionResult
          )
          sourceFlowmetaNode.updateConnector(connection.target, Index)
        }
        sourceFlowmetaNode.updateConnector(
          connection.target,
          'nextValueConnector'
        )
        console.log('cavas', canvas.edges)
        next(payload)
      }, 500)

      // canvas.edges = addEdge(newEdge, canvas.edges)
      // console.log('canvas.edges', canvas.edges)
    })
    .forCancel((payload, next) => {
      setTimeout(() => {
        next(payload)
      }, 500)
    })
    .open()
}

export const loopConnectDialog = (
  targetNode: string,
  connection: Connection,
  canvas: ICanvas,
  sourceFlowmetaNode: FlowMetaNode
) => {
  const dialog = FormDialog('选择决策连接器的结果', () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10}>
        <div>要转到&quot;{targetNode}&quot; 元素，必须满足哪些结果条件？</div>
        <SchemaField schema={loopConnectSchema} />
      </FormLayout>
    )
  })
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({})
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        const newEdge = {
          ...connection,
          label: payload.values.loopResult,
        }
        payload.values.loopResult === 'For Each Item'
          ? sourceFlowmetaNode.updateConnector(
              connection.target,
              'defaultConnector'
            )
          : sourceFlowmetaNode.updateConnector(
              connection.target,
              'nextValueConnector'
            )
        canvas.edges = addEdge(newEdge, canvas.edges)
        console.log('cavas', canvas.edges)
        next(payload)
      }, 500)

      // canvas.edges = addEdge(newEdge, canvas.edges)
      // console.log('canvas.edges', canvas.edges)
    })
    .forCancel((payload, next) => {
      setTimeout(() => {
        next(payload)
      }, 500)
    })
    .open()
}
