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
            {handleProps.type === 'source' && (
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
