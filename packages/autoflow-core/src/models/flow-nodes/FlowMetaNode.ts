import { FlowNode, IFlowNodeProps } from '@toy-box/flow-graph'
import { FlowMetaType } from '../../types'
import { MetaFlow } from '../MetaFlow'

export interface IMakeFlowNodeProps {
  width: number
  height: number
  x?: number
  y?: number
  component: string
}

export abstract class FlowMetaNode {
  id: string
  name: string
  description?: string
  metaFlow: MetaFlow

  static StandardSize = 30

  constructor(
    metaFlow: MetaFlow,
    id: string,
    name: string,
    description?: string
  ) {
    this.metaFlow = metaFlow
    this.id = id
    this.name = name
    this.description = description
  }

  get flowNode() {
    return this.metaFlow.flow.getFlowNode(this.id)
  }

  abstract type: FlowMetaType

  abstract makeFlowNode(props?: IMakeFlowNodeProps): IFlowNodeProps

  abstract appendAt(at: FlowNode): void
}
