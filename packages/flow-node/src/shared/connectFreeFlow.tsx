import { FlowMetaNode } from '@toy-box/autoflow-core'
import React, { FC, ReactNode } from 'react'
import { Handle, HandleProps, Position, useStore } from 'reactflow'
import { useFreeFlow, useMetaFlow } from '../hooks'
import { IStandardNodeProps } from '../standard-node'
import { FlowMetaNodeContext } from './context'
import { INodeTemplate } from '../types'
import { NodeMake } from '../shared'

import './connectFreeFlow.less'

interface IConnectReactFlowProps {
  component: FC<IStandardNodeProps>
  content?: ReactNode
  handles?: HandleProps[]
  onEdit?: (node: FlowMetaNode | INodeTemplate<NodeMake>, at?: string) => void
}

export function connectFreeFlow({
  component: TargetComponent,
  content,
  handles,
  onEdit,
}: IConnectReactFlowProps) {
  const connectionNodeIdSelector = (state) => state.connectionNodeId
  const FlowNodeWrapper = (props: IStandardNodeProps) => {
    const connectionNodeId = useStore(connectionNodeIdSelector)
    const isTarget = connectionNodeId && connectionNodeId !== props.id
    console.log('connectionNodeId', connectionNodeId, props)
    const freeFlow = useFreeFlow()
    console.log('connect ', freeFlow.flowMetaNodeMap)
    console.log(
      'miwoyo handles props nods',
      handles,
      props,
      freeFlow.flow.canvas.nodes
    )
    const {
      nextNodes,
      data: { rules },
    } = freeFlow.flow.canvas.nodes.find((node) => node.id === props.id)

    const isTargetHandle = () => {
      switch (props.type) {
        case 'AssignmentNode':
          return nextNodes ? !nextNodes.length : true
        case 'DecisionNode':
          return nextNodes ? nextNodes.length < rules.length : true
        case 'LoopNode':
          return nextNodes ? nextNodes.length < 2 : true
        default:
          return true
      }
    }
    console.log('isTargetHandle', isTargetHandle(), nextNodes)

    return (
      <React.Fragment>
        {handles?.map((handleProps, idx) => (
          <>
            {handleProps.type === 'target' && (
              <Handle
                className="sourceHandle"
                key={idx}
                isConnectable={true}
                {...handleProps}
                style={{ zIndex: isTarget ? 3 : -1 }}
              />
            )}
            {handleProps.type === 'source' && isTargetHandle() && (
              <Handle
                className="targetHandle"
                key={idx}
                isConnectable={true}
                {...handleProps}
                style={{ zIndex: 2 }}
              />
            )}
          </>
        ))}
        <FlowMetaNodeContext.Provider
          value={{ flowMetaNode: freeFlow.flowMetaNodeMap[props.id], onEdit }}
        >
          <TargetComponent {...props}>{content}</TargetComponent>
        </FlowMetaNodeContext.Provider>
      </React.Fragment>
    )
  }
  return FlowNodeWrapper
}
