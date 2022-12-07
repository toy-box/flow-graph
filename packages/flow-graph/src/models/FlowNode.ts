import { uid } from '@toy-box/toybox-shared'
import { FlowGraph } from './FlowGraph'
import { FlowNodeType, INode } from '../types'

const CYCLE_FLOW_WIDTH = 50

export type TargetType = string | TargetProps

export interface TargetProps {
  id: string
  edgeId: string
  label?: string
}

export interface IFlowNodeProps extends Omit<INode, 'id' | 'x' | 'y'> {
  id?: string
  type: FlowNodeType
  width: number
  height: number
  x?: number
  y?: number
  label?: string
  targets?: TargetType[]
  component?: string
  decisionEndTarget?: string
  loopEndTarget?: string
  loopBackTarget?: string
  shadowNode?: string
  data?: unknown
}

export class FlowNode {
  id: string
  type: FlowNodeType
  width: number
  height: number
  flowGraph: FlowGraph
  x: number
  y: number
  label?: string
  targets?: TargetProps[]
  component?: string
  decisionEndTarget?: string
  loopEndTarget?: string
  shadowNode?: string
  data?: unknown

  constructor(props: IFlowNodeProps, flowGraph: FlowGraph) {
    this.id = props.id ?? uid()
    this.type = props.type || 'forward'
    this.width = props.width
    this.height = props.height
    this.x = props.x || 0
    this.y = props.y || 0
    this.label = props.label
    this.targets = props.targets?.map((target) =>
      typeof target === 'string'
        ? { id: target, edgeId: uid() }
        : { ...target, edgeId: uid() }
    )
    this.component = props.component
    // this.loopBackTarget = props.loopBackTarget;
    this.loopEndTarget = props.loopEndTarget
    this.decisionEndTarget = props.decisionEndTarget
    this.shadowNode = props.shadowNode
    this.flowGraph = flowGraph
    this.data = props.data
  }

  setTarget(targets: TargetType[]) {
    this.flowGraph.setTarget(
      this.id,
      targets.map((target) =>
        typeof target === 'string'
          ? { id: target, edgeId: uid() }
          : { ...target, edgeId: uid() }
      )
    )
  }

  setPostion(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height
  }

  isParentOf(id: string) {
    return this.targets?.some((target) => target.id === id)
  }

  get loopBackTarget() {
    return this.loopEnd?.parents[0]?.id
  }

  get loopBack() {
    return this.flowGraph.nodes.find((node) => node.id === this.loopBackTarget)
  }

  get areaOutNode(): FlowNode | undefined {
    return this.isAreaBegin
      ? this.areaEndNode
      : this.flowGraph.nodes.find((node) => node.id === this.targets?.[0].id)
  }

  get parents() {
    return this.flowGraph.nodes.filter((node) => node.isParentOf(this.id))
  }

  get left() {
    return this.x - this.width / 2
  }

  get right() {
    return this.x + this.width / 2
  }

  get centerX() {
    return this.x + this.width / 2
  }

  get centerY() {
    return this.y + this.height / 2
  }

  get isAreaNode() {
    return this.isLoopBegin || this.isDecisionBegin
  }

  get isAreaBegin() {
    return this.isAreaNode
  }

  get isDecisionBegin() {
    return this.type === 'decisionBegin'
  }

  get isAreaEnd() {
    return this.isLoopEnd || this.decisionEnd
  }

  // exclude cycle path node
  get nextNodes() {
    return (this.targets || []).map((target) =>
      this.flowGraph.getNode(target.id)
    )
  }

  get areaEndNode(): FlowNode | undefined {
    return this.decisionEnd || this.loopEnd
  }

  get innerNodes(): FlowNode[] {
    if (this.areaEndNode) {
      return this.flowGraph.getInnerNodes(this, this.areaEndNode)
    }
    return []
  }

  get bindNodes(): FlowNode[] {
    if (this.isAreaBegin) {
      return [this, ...this.innerNodes]
    }
    return [this, ...this.children]
  }

  get areaWidth(): number {
    if (this.innerNodes.length > 0) {
      const leftNode = this.innerNodes.reduce((prev, current) =>
        prev.left < current.left ? current : prev
      )
      const rightNode = this.innerNodes.reduce((prev, current) =>
        prev.right < current.right ? current : prev
      )
      return (
        rightNode.right -
        leftNode.left +
        this.innerCycles * CYCLE_FLOW_WIDTH * 2
      )
    }
    return this.width
  }

  get innerCycles() {
    const nodeLength = this.innerNodes.filter(
      (node) => node.type === 'loopBegin'
    ).length
    return nodeLength + (this.type === 'loopBegin' ? 1 : 0)
  }

  get loopEnd(): FlowNode | undefined {
    return this.flowGraph.nodes.find((node) => node.id === this.loopEndTarget)
  }

  get loopBegin() {
    return this.flowGraph.nodes.find(
      (node) =>
        node.loopBackTarget === this.id || node.loopEndTarget === this.id
    )
  }

  // isLoopBack => loopBackTarget => loopEnd => parents
  get isLoopBack() {
    // console.log('isLoopBack', this.id)
    return this.flowGraph.nodes.some((node) => node.loopBackTarget === this.id)
  }

  get isLoopEnd() {
    return this.flowGraph.nodes.some((node) => node.loopEndTarget === this.id)
  }

  get isLoopBegin() {
    return this.type === 'loopBegin'
  }

  get isDecisionEnd() {
    return (
      this.type === 'decisionEnd' ||
      this.flowGraph.nodes.some(
        (node) =>
          node.type === 'decisionBegin' && node.decisionEndTarget === this.id
      )
    )
  }

  get decisionEnd(): FlowNode | undefined {
    return this.flowGraph.nodes.find(
      (node) => node.id === this.decisionEndTarget
    )
  }

  get children() {
    return (this.targets ?? []).map((target) =>
      this.flowGraph.getNode(target.id)
    )
  }
}
