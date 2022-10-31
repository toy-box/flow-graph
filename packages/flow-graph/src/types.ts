import { Node } from 'reactflow'

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
  data?: unknown
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
  data?: unknown
}

export type INodeProps = Node
