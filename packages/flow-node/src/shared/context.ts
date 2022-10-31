import React, { ReactNode } from 'react'
import { FlowMetaParam, MetaFlow } from '@toy-box/autoflow-core'
import { EventEngine } from './event'
import { INodeTemplate } from '../types'

export type NodeMake<T> = (template: T) => void

export interface IFlowContextProps<T> {
  metaFlow: MetaFlow
  templates: INodeTemplate<T>[]
  icons: Record<string, ReactNode>
  eventEngine: EventEngine
}

export const FlowContext = React.createContext<
  IFlowContextProps<FlowMetaParam> | undefined
>(undefined)
