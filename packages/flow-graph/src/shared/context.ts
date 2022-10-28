import React, { ReactNode } from 'react'
import { Flow } from '../models'
import { INodeTemplate } from '../types'
import { EventEngine } from './event'

export interface IFlowContextProps {
  flow: Flow<any>
  nodes: INodeTemplate[]
  icons: Record<string, ReactNode>
  eventEngine: EventEngine
}

export const FlowContext = React.createContext<IFlowContextProps | undefined>(
  undefined
)
