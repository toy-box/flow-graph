import { FlowMetaNode } from '@toy-box/autoflow-core'
import React, { FC, ReactNode } from 'react'
import { Handle, HandleProps } from 'reactflow'
import { useFreeFlow, useMetaFlow } from '../hooks'
import { IStandardNodeProps } from '../standard-node'
import { FlowMetaNodeContext } from './context'
import { INodeTemplate } from '../types'
import { NodeMake } from '../shared'

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
  const FlowNodeWrapper = (props: IStandardNodeProps) => {
    const freeFlow = useFreeFlow()
    console.log('connect ', freeFlow.flowMetaNodeMap)
    return (
      <React.Fragment>
        {handles?.map((handleProps, idx) => (
          <Handle
            key={idx}
            isConnectable={false}
            {...handleProps}
            style={{ opacity: 0 }}
          />
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
