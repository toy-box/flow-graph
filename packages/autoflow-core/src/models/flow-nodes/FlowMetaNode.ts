import { FlowNode, IFlowNodeProps } from '@toy-box/flow-graph'
import { FlowMetaType, TargetReference } from '../../types'
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

  static ExtendNodeProps: IMakeFlowNodeProps = {
    width: FlowMetaNode.StandardSize,
    height: FlowMetaNode.StandardSize,
    component: 'ExtendNode',
  }

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

  get parents() {
    return this.metaFlow.flowMetaNodes.filter((node) =>
      node.nextNodes.some((next) => next.id === this.id)
    )
  }

  findLoopBack(id: string = this.id) {
    for (let i = 0; i < this.nextNodes.length; i++) {
      if (this.nextNodes[i].nextNodes.some((node) => node.id === id)) {
        return this.nextNodes[i]
      }
    }
    for (let i = 0; i < this.nextNodes.length; i++) {
      const backNode = this.nextNodes[i].findLoopBack(id)
      if (backNode != null) {
        return backNode
      }
    }
  }

  abstract lowerLeverConnector?: TargetReference

  abstract nextNodes: FlowMetaNode[]

  abstract type: FlowMetaType

  abstract makeFlowNode(props?: IMakeFlowNodeProps): IFlowNodeProps

  abstract appendAt(at: FlowNode): void
}
