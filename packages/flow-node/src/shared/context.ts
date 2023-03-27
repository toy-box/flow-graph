import React, { ReactNode } from 'react'
import { MetaFlow, FreeFlow, FlowMetaNode } from '@toy-box/autoflow-core'
import { EventEngine } from './event'
import { INodeTemplate, INodeEdit } from '../types'

export type NodeMake = (at: string, editInfo?: INodeEdit) => void

export interface IFlowContextProps<T> {
  // freeFlow: FreeFlow
  metaFlow: MetaFlow | FreeFlow
  templates: INodeTemplate<T>[]
  icons: Record<string, ReactNode>
  eventEngine: EventEngine
  connectDialog: any
  shortcut?: any
}

export const FlowContext = React.createContext<
  IFlowContextProps<NodeMake> | undefined
>(undefined)

export interface IFlowMetaNodeContextProps {
  flowMetaNode: FlowMetaNode
  onEdit: (node: FlowMetaNode | INodeTemplate<NodeMake>, at?: string) => void
}
export const FlowMetaNodeContext =
  React.createContext<IFlowMetaNodeContextProps>(undefined)
