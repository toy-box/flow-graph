import React, { ReactNode } from 'react'
import { MetaFlow, FlowMetaNode } from '@toy-box/autoflow-core'
import { EventEngine } from './event'
import { INodeTemplate } from '../types'

export type NodeMake = (at: string) => void

export interface IFlowContextProps<T> {
  metaFlow: MetaFlow
  templates: INodeTemplate<T>[]
  icons: Record<string, ReactNode>
  eventEngine: EventEngine
}

export const FlowContext = React.createContext<
  IFlowContextProps<NodeMake> | undefined
>(undefined)

export interface IFlowMetaNodeContextProps {
  flowMetaNode: FlowMetaNode
  onEdit: (node: FlowMetaNode) => void
}
export const FlowMetaNodeContext =
  React.createContext<IFlowMetaNodeContextProps>(undefined)
