import { FormDialog, FormItem, FormLayout, Select } from '@formily/antd'
import { createSchemaField } from '@formily/react'
import React from 'react'
import { ReactFlowCanvas } from '@toy-box/flow-graph'
import { Connection, addEdge } from 'reactflow'
import { FlowMetaNode, FlowMetaType } from '@toy-box/autoflow-core'
import { uid } from '@toy-box/toybox-shared'

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
  canvas: ReactFlowCanvas,
  loadData?: any,
  sourceFlowmetaNode?: any
) => {
  const { target, source } = connection
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
        const { label } = loadData.find(
          (data) => data.value === payload.values.decisionResult
        )
        const newEdge = {
          ...connection,
          label: label,
          id: uid(),
        }
        canvas.edges = [newEdge, ...canvas.edges]
        if (payload.values.decisionResult.split('-')[0] === 'default') {
          sourceFlowmetaNode.updateConnector(target, 'defaultConnector')
          canvas.flowGraph.setTarget(source, [
            ...canvas.flowGraph.nodeMap[source].targets,
            {
              id: target,
              label: newEdge.label,
              edgeId: newEdge.id,
              ruleId: payload.values.decisionResult,
            },
          ])
        } else {
          const Index = sourceFlowmetaNode.rules.findIndex(
            ({ id }) => id === payload.values.decisionResult
          )
          sourceFlowmetaNode.updateConnector(target, Index)
          sourceFlowmetaNode.flowNode.targets.push({
            id: target,
            label: newEdge.label,
            ruleId: payload.values.decisionResult ?? null,
            edgeId: newEdge.id,
          })
        }
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

export const loopConnectDialog = (
  targetNode: string,
  connection: Connection,
  canvas: ReactFlowCanvas,
  sourceFlowmetaNode: any
) => {
  const { target, source } = connection
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
          id: uid(),
          label: payload.values.loopResult,
        }
        payload.values.loopResult === 'For Each Item'
          ? sourceFlowmetaNode.updateConnector(target, 'nextValueConnector')
          : sourceFlowmetaNode.updateConnector(target, 'defaultConnector')
        canvas.flowGraph.setTarget(source, [
          ...canvas.flowGraph.nodeMap[source].targets,
          {
            id: target,
            label: newEdge.label,
            edgeId: newEdge.id,
          },
        ])
        canvas.edges = [newEdge, ...canvas.edges]
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
