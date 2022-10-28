import { Node } from 'reactflow'
import { IFlowBatch, TargetType } from './models'

export type FlowNodeType =
  | 'begin'
  | 'end'
  | 'decisionBegin'
  | 'decisionEnd'
  | 'loopBegin'
  | 'loopBack'
  | 'loopEnd'
  | 'forward'
  | 'extend'
  | 'shadow'

export interface INode {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: FlowNodeType
  component?: string
  data?: Record<string, any>
}

export interface Point {
  x: number
  y: number
}

export interface IEdge {
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: string
  label?: string
  data?: any
}

export type INodeProps = Node

export interface INodeTemplate {
  icon: string
  title: string
  description: string
  group: string
  make: (at: string, targets?: TargetType[]) => IFlowBatch
}
