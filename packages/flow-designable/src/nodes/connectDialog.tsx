import React from 'react'
import { Connection } from 'reactflow'
import { FormDialog, FormItem, FormLayout, Select } from '@formily/antd'
import { createSchemaField } from '@formily/react'
import { ReactFlowCanvas } from '@toy-box/flow-graph'
import { OpearteTypeEnum } from '@toy-box/autoflow-core'
import { uid } from '@toy-box/toybox-shared'
import { AutoFlow } from '../interface'
import { TextWidget } from '@toy-box/studio-base'

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
      title: (
        <TextWidget token="flowDesigner.flow.form.comm.result"></TextWidget>
      ),
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
      title: (
        <TextWidget token="flowDesigner.flow.form.comm.result"></TextWidget>
      ),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          label: (
            <TextWidget token="flowDesigner.flow.form.loopConnect.eachResult" />
          ),
          value: 'For Each Item',
        },
        {
          label: (
            <TextWidget token="flowDesigner.flow.form.loopConnect.lastResult" />
          ),
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
  freeFlow: AutoFlow,
  loadData?: any,
  sourceFlowmetaNode?: any
) => {
  const { target, source } = connection
  const useAsyncDataSource = (loadData) => (field) => {
    field.dataSource = loadData
    field.data = loadData[0].value
  }
  const dialog = FormDialog(
    {
      title: (
        <TextWidget token="flowDesigner.flow.form.deciConnect.addTitle"></TextWidget>
      ),
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <div>
            <TextWidget>
              flowDesigner.flow.form.deciConnect.extraConnectTip
            </TextWidget>
            &quot;{targetNode}&quot;
            <TextWidget>
              flowDesigner.flow.form.deciConnect.lastConnectTip
            </TextWidget>
          </div>
          <SchemaField
            schema={decisonConnectSchema}
            scope={{ useAsyncDataSource, loadData }}
          />
        </FormLayout>
      )
    }
  )
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({})
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        const edgeId = uid()
        const flowMetaNodeMap = { ...freeFlow.flowMetaNodeMap }
        const { label, ruleId } = loadData.find(
          (data) => data.value === payload.values.decisionResult
        )
        const newEdge = {
          ...connection,
          label: label,
          id: edgeId,
        }
        canvas.edges = [newEdge, ...canvas.edges]
        if (!ruleId) {
          sourceFlowmetaNode.updateConnector(target, 'defaultConnector')
          canvas.flowGraph.setTarget(source, [
            ...canvas.flowGraph.nodeMap[source].targets,
            {
              id: target,
              label: newEdge.label,
              edgeId: newEdge.id,
            },
          ])
        } else {
          const { rules } = sourceFlowmetaNode
          const Index = sourceFlowmetaNode[
            rules ? 'rules' : 'waitEvents'
          ].findIndex(({ id }) => id === payload.values.decisionResult)
          sourceFlowmetaNode.updateConnector(target, Index)
          sourceFlowmetaNode.flowNode.targets.push({
            id: target,
            label: newEdge.label,
            ruleId: payload.values.decisionResult ?? null,
            edgeId: newEdge.id,
          })
        }
        freeFlow?.history?.push({
          type: OpearteTypeEnum.ADD_EDGE,
          edges: [
            {
              ...newEdge,
              id: edgeId,
            },
          ],
          updateMetaNodeMap: { ...freeFlow.flowMetaNodeMap },
          flowMetaNodeMap,
        })
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
  freeFlow: AutoFlow,
  sourceFlowmetaNode: any
) => {
  const { target, source } = connection
  const dialog = FormDialog(
    {
      title: (
        <TextWidget token="flowDesigner.flow.form.deciConnect.addTitle"></TextWidget>
      ),
    },
    () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10}>
          <div>
            <TextWidget>
              flowDesigner.flow.form.loopConnect.extraConnectTip
            </TextWidget>
            &quot;{targetNode}&quot;
            <TextWidget>
              flowDesigner.flow.form.loopConnect.lastConnectTip
            </TextWidget>
          </div>
          <SchemaField schema={loopConnectSchema} />
        </FormLayout>
      )
    }
  )
  dialog
    .forOpen((payload, next) => {
      setTimeout(() => {
        next({})
      }, 500)
    })
    .forConfirm((payload, next) => {
      setTimeout(() => {
        const edgeId = uid()
        const flowMetaNodeMap = { ...freeFlow.flowMetaNodeMap }
        const newEdge = {
          ...connection,
          id: edgeId,
          label: payload.values.loopResult,
        }
        payload.values.loopResult === 'For Each Item'
          ? sourceFlowmetaNode.updateConnector(target, false)
          : sourceFlowmetaNode.updateConnector(target, true)
        canvas.flowGraph.setTarget(source, [
          ...canvas.flowGraph.nodeMap[source].targets,
          {
            id: target,
            label: newEdge.label,
            edgeId: newEdge.id,
          },
        ])
        freeFlow?.history?.push({
          type: OpearteTypeEnum.ADD_EDGE,
          edges: [
            {
              ...newEdge,
              id: edgeId,
            },
          ],
          updateMetaNodeMap: { ...freeFlow.flowMetaNodeMap },
          flowMetaNodeMap,
        })
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

export const deleteDialog = () => {
  return FormDialog(
    {
      title: (
        <TextWidget token="flowDesigner.flow.form.comm.deleteTitle"></TextWidget>
      ),
    },
    () => {
      return (
        <TextWidget token="flowDesigner.flow.form.comm.deleteDesc"></TextWidget>
      )
    }
  )
}