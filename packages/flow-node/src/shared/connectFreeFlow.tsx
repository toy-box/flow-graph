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
      // nextNodes,
      data: { rules },
      data: {
        flowNode: { targets },
      },
    } = freeFlow.flow.canvas.nodes.find((node) => node.id === props.id)

    const isTargetHandle = () => {
      switch (props.type) {
        case 'AssignmentNode':
        case 'StartNode':
          return targets ? !targets.length : true
        case 'DecisionNode':
          console.log('IConnectReactFlowProps targets,rules', targets, rules)
          return targets ? targets.length < rules.length + 1 : true
        case 'LoopNode':
          return targets ? targets.length < 2 : true
        default:
          return true
      }
    }

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
            <Handle
              className="targetHandle"
              key={idx}
              isConnectable={true}
              {...handleProps}
              style={{
                zIndex: 2,
                display: isTargetHandle() ? 'inherit' : 'none',
              }}
            />
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
