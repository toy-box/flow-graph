import { uid } from '@toy-box/toybox-shared'
import { IEdge } from '../types'

export interface IFlowEdgeProps extends IEdge {
  deletable: boolean
}

export class FlowEdge {
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
  label: string
  type: string
  data?: unknown
  deletable = false

  constructor(props: IFlowEdgeProps) {
    this.id = uid()
    this.source = props.source
    this.target = props.target
    this.sourceHandle = props.sourceHandle
    this.targetHandle = props.targetHandle
    this.label = props.label
    this.type = props.type
    this.data = props.data
    this.deletable = props.deletable
  }

  updateEdge(updateEdge: Omit<FlowEdge, 'type'>) {
    this.source = updateEdge.source
    this.target = updateEdge.target
    this.sourceHandle = updateEdge.sourceHandle
    this.targetHandle = updateEdge.targetHandle
    this.label = updateEdge.label
    this.data = updateEdge.data
    this.deletable = updateEdge.deletable
  }
}
