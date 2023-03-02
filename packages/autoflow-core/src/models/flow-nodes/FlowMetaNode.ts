import { Connection } from 'reactflow'
import {
  FlowNode,
  IFlowNodeProps,
  LayoutModeEnum,
  ReactFlowCanvas,
} from '@toy-box/flow-graph'
import { FlowMetaParam, FlowMetaType, TargetReference } from '../../types'
import { MetaFlow } from '../MetaFlow'
import { FreeFlow } from '../FreeFlow'
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
  x?: number
  y?: number
  description?: string
  metaFlow: MetaFlow | FreeFlow
  flowType: string
  static StandardSize = 30

  static ExtendNodeProps: IMakeFlowNodeProps = {
    width: FlowMetaNode.StandardSize,
    height: FlowMetaNode.StandardSize,
    component: 'ExtendNode',
  }

  constructor(
    flow: MetaFlow | FreeFlow,
    id: string,
    name: string,
    description?: string
  ) {
    this.metaFlow = flow
    this.flowType = flow.flowType
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

  get position() {
    if (this.metaFlow.layoutMode === LayoutModeEnum.FREE_LAYOUT) {
      const {
        position: { x, y },
      } = this.metaFlow.flow.canvas.nodes.find(({ id }) => this.id === id)
      return { x, y }
    }
  }

  // abstract connectDialog(
  //   targetNode: string,
  //   connection: Connection,
  //   canvas: ReactFlowCanvas,
  //   loadData?: any,
  //   sourceFlowmetaNode?: FlowMetaNode
  // ): void

  abstract lowerLeverConnector?: TargetReference

  abstract nextNodes: FlowMetaNode[]

  abstract type: FlowMetaType

  abstract makeFlowNode(props?: IMakeFlowNodeProps): IFlowNodeProps

  abstract appendAt(at: FlowNode): void

  abstract appendFreeAt(flowData: FlowMetaParam): void

  // abstract append(at: FlowNode): void

  abstract update(payload: any): void

  // abstract updateConnector(targetId: string, options?: string | number): void

  abstract deleteConnector(targetId: string, label?: any): void

  abstract toJson()
}
