import React, { FC, ReactNode } from 'react'
import { Handle, HandleProps, useStore, Connection } from 'reactflow'
import { FlowMetaNode } from '@toy-box/autoflow-core'
import { ReactFlowCanvas } from '@toy-box/flow-graph'
import { useFreeFlow, useMetaFlow } from '../hooks'
import { IStandardNodeProps } from '../standard-node'
import { FlowMetaNodeContext } from './context'
import { INodeTemplate } from '../types'
import { NodeMake } from '../shared'
import { uid } from '@toy-box/toybox-shared'

import './connectFreeFlow.less'

interface IConnectReactFlowProps {
  component: FC<IStandardNodeProps>
  content?: ReactNode
  handles?: HandleProps[]
  onEdit?: (node: FlowMetaNode | INodeTemplate<NodeMake>, at?: string) => void
  connectDialog?: (
    targetNode: string,
    connection: Connection,
    canvas: ReactFlowCanvas,
    loadData?: any,
    sourceFlowmetaNode?: FlowMetaNode
  ) => void
}

export function connectFreeFlow({
  component: TargetComponent,
  content,
  handles,
  onEdit,
  connectDialog,
}: IConnectReactFlowProps) {
  const connectionNodeIdSelector = (state) => state.connectionNodeId
  const FlowNodeWrapper = (props: IStandardNodeProps) => {
    const connectionNodeId = useStore(connectionNodeIdSelector)
    const isTarget = connectionNodeId && connectionNodeId !== props.id
    const freeFlow = useFreeFlow()
    const getFlowMetaNode = freeFlow.flowMetaNodeMap[props.id]
    getFlowMetaNode.connectDialog = connectDialog
    const targetNode = freeFlow.flow.canvas.nodes.find(
      (node) => node.id === props.id
    )
    // const {
    //   // nextNodes,
    //   data: { rules },
    //   data: {
    //     flowNode: { targets },
    //   },
    // } = freeFlow.flow.canvas.nodes.find((node) => node.id === props.id)

    const isTargetHandle = () => {
      if (targetNode) {
        const {
          data: { rules, waitEvents },
          data: {
            flowNode: { targets },
          },
        } = targetNode
        switch (props.type) {
          case 'AssignmentNode':
          case 'StartNode':
          case 'SortCollectionNode':
            return targets ? !targets.length : true
          case 'WaitNode':
          case 'DecisionNode':
            const array = rules ?? waitEvents
            return targets ? targets.length < array.length + 1 : true
          case 'LoopNode':
          case 'RecordCreateNode':
          case 'RecordUpdateNode':
          case 'RecordDeleteNode':
          case 'RecordLookupNode':
            return targets ? targets.length < 2 : true
          default:
            return true
        }
      }
    }

    return (
      <React.Fragment>
        {handles?.map((handleProps, idx) => (
          <>
            {handleProps.type === 'target' && (
              <Handle
                className="sourceHandle"
                isConnectable={true}
                {...handleProps}
                style={{ zIndex: isTarget ? 3 : -1 }}
              />
            )}
            <Handle
              className="targetHandle"
              isConnectable={true}
              {...handleProps}
              style={{
                zIndex: 2,
                visibility: isTargetHandle() ? 'inherit' : 'hidden',
              }}
            />
          </>
        ))}
        <FlowMetaNodeContext.Provider
          value={{ flowMetaNode: getFlowMetaNode, onEdit }}
        >
          <TargetComponent {...props}>{content}</TargetComponent>
        </FlowMetaNodeContext.Provider>
      </React.Fragment>
    )
  }
  return FlowNodeWrapper
}
