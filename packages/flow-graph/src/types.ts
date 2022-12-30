import { Node, Edge } from 'reactflow'

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
  id?: string
  // zIndex?: number
  // selected?: boolean
}

export enum LayoutModeEnum {
  AUTO_LAYOUT = 'auto_layout',
  FREE_LAYOUT = 'free_layout',
}

export enum EdgeTypeEnum {
  FAULT_EDGE = 'faultEdge',
  FREE_EDGE = 'freeEdge',
  FIX_EDGE = 'fixEdge',
}

export type INodeProps = Node
