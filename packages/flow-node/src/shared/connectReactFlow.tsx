import { FlowMetaNode } from '@toy-box/autoflow-core'
import React, { FC, ReactNode } from 'react'
import { Handle, HandleProps } from 'reactflow'
import { useMetaFlow } from '../hooks'
import { IStandardNodeProps } from '../standard-node'
import { FlowMetaNodeContext } from './context'
import { INodeTemplate } from '../types'
import { NodeMake } from '../shared'

export interface IConnectReactFlowProps {
  component: FC<IStandardNodeProps>
  content?: ReactNode
  handles?: HandleProps[]
  onEdit?: (node: FlowMetaNode | INodeTemplate<NodeMake>, at?: string) => void
}

export function connectReactFlow({
  component: TargetComponent,
  content,
  handles,
  onEdit,
}: IConnectReactFlowProps) {
  const FlowNodeWrapper = (props: IStandardNodeProps) => {
    const metaFlow = useMetaFlow()
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
          value={{ flowMetaNode: metaFlow.flowMetaNodeMap[props.id], onEdit }}
        >
          <TargetComponent {...props}>{content}</TargetComponent>
        </FlowMetaNodeContext.Provider>
      </React.Fragment>
    )
  }
  return FlowNodeWrapper
}
