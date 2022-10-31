import React, { FC, ReactNode } from 'react'
import { Handle, HandleProps } from 'reactflow'
import { IStandardNodeProps } from '../standard-node'

export interface IConnectReactFlowProps {
  component: FC<IStandardNodeProps>
  onClick?: (id: string, data: any) => void
  content?: ReactNode
  handles?: HandleProps[]
}

export function connectReactFlow({
  component: TargetComponent,
  content,
  handles,
  onClick,
}: IConnectReactFlowProps) {
  const FlowNodeWrapper = (props: IStandardNodeProps) => {
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
        <div onClick={() => onClick && onClick(props.id, props.data)}>
          <TargetComponent {...props}>{content}</TargetComponent>
        </div>
      </React.Fragment>
    )
  }
  return FlowNodeWrapper
}
