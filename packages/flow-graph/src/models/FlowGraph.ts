import dagre from '@toy-box/dagre'
import { action, batch, define, observable } from '@formily/reactive'
import { uid } from '@toy-box/toybox-shared'
import { FlowNode, IFlowNodeProps, TargetProps } from './FlowNode'
import { UpdateNodeProps } from './Flow'

export interface IFlowGraphProps {
  id?: string
  nodes?: IFlowNodeProps[]
  standardSize?: number
  centerX?: number
}

export class FlowGraph {
  id: string
  nodeMap: Record<string, FlowNode> = {}
  dg: dagre.graphlib.Graph
  standardSize: number
  centerX: number

  constructor(props: IFlowGraphProps) {
    this.id = props.id || uid()
    this.standardSize = props.standardSize ?? 0
    this.dg = new dagre.graphlib.Graph()
    this.dg.setGraph(this.config)
    this.dg.setDefaultEdgeLabel(() => ({}))
    props.nodes?.forEach((node) => {
      this.addNode(node)
    })
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      id: observable.ref,
      nodeMap: observable.shallow,
      standardSize: observable.ref,
      centerX: observable.ref,
      nodes: observable.computed,
      setNodes: batch,
      addNodeAt: batch,
      addNode: action,
      updateNode: batch,
      removeNode: batch,
      removeNodes: batch,
      layout: batch,
    })
  }

  get config() {
    return {
      rankdir: 'TB',
      ranker: 'short-tree',
      nodesep: this.standardSize * 6,
      ranksep: this.standardSize * 3,
    }
  }

  get shadowSize() {
    return this.standardSize
  }

  get nodeSize() {
    return this.standardSize * 3
  }

  get nodes() {
    return Object.keys(this.nodeMap).map((key) => this.nodeMap[key])
  }

  get shadowNodes() {
    return this.nodes.filter((node) => node.type === 'shadow')
  }

  setNodes(nodes: IFlowNodeProps[]) {
    this.dg = new dagre.graphlib.Graph()
    this.dg.setGraph(this.config)
    this.dg.setDefaultEdgeLabel(() => ({}))
    this.nodeMap = {}
    nodes.forEach((node) => {
      this.addNode(node)
    })
  }

  addNodeAt(at: string, node: IFlowNodeProps) {
    const newNode = this.addNode({
      ...node,
    })
    this.setTarget(at, [{ id: newNode.id }])
    return newNode
  }

  addNode(node: IFlowNodeProps) {
    const isDecision =
      node.type === 'decisionBegin' || node.type === 'decisionEnd'
    if (!isDecision) {
      const flowNode = new FlowNode(node, this)
      this.nodeMap[flowNode.id] = flowNode
      this.dg.setNode(flowNode.id, {
        width: 0,
        height: flowNode.height,
      })
      flowNode.targets?.forEach((target) => {
        this.dg.setEdge(flowNode.id, target.id, {
          id: uid(),
        })
      })
      return flowNode
    } else {
      // has shadow node
      if (node.type === 'decisionBegin') {
        const shadowNode = new FlowNode(
          {
            ...node,
            id: uid(),
            type: 'shadow',
            width:
              this.nodeSize * (node.targets || []).length +
              this.config.nodesep * ((node.targets || []).length - 1),
            height: this.shadowSize,
          },
          this
        )
        const flowNode = new FlowNode(
          { ...node, shadowNode: shadowNode.id },
          this
        )
        this.nodeMap[flowNode.id] = flowNode
        this.nodeMap[shadowNode.id] = shadowNode
        this.dg.setNode(flowNode.id, {
          width: flowNode.width,
          height: flowNode.height,
        })

        this.dg.setNode(shadowNode.id, {
          width: flowNode.width,
          height: shadowNode.height,
        })
        this.dg.setEdge(flowNode.id, shadowNode.id, { id: uid() })
        ;(flowNode.targets || []).forEach((target) => {
          this.dg.setEdge(shadowNode.id, target.id, { id: uid() })
        })
        return flowNode
      } else {
        const flowNode = new FlowNode(node, this)
        this.nodeMap[flowNode.id] = flowNode
        this.dg.setNode(flowNode.id, {
          width: flowNode.width,
          height: flowNode.height * 2,
        })
        flowNode.targets?.forEach((target) => {
          this.dg.setEdge(flowNode.id, target.id, { id: uid() })
        })
        return flowNode
      }
    }
  }

  addNodes(nodes: IFlowNodeProps[]) {
    return nodes.map((node) => this.addNode(node))
  }

  updateNode(updateNode: UpdateNodeProps) {
    const { id, ...others } = updateNode
    const node = this.nodeMap[id]
    if (node) {
      for (const key in others) {
        node[key] = others[key]
      }
    }
  }

  setTarget(id: string, targets: TargetProps[] = []) {
    if (this.nodeMap[id]) {
      this.nodeMap[id].targets?.forEach((target) => {
        this.dg.removeEdge(id, target.id)
      })
      this.nodeMap[id].targets = targets
      targets.forEach((target) => {
        this.dg.setEdge(id, target.id)
      })
    }
  }

  removeNode(id: string) {
    const node = this.nodeMap[id]
    const parents = this.nodes.filter((node) => node.isParentOf(id))
    if (node.areaOutNode) {
      const targets = node.areaOutNode.targets
      parents.forEach((parent) => {
        this.setTarget(parent.id, targets)
      })
    }
    // 移除关联节点
    if (node) {
      node.bindNodes
        .map((node) => node.id)
        .forEach((key) => {
          this.dg.removeNode(key)
          this.nodeMap[key].targets?.forEach((target) => {
            this.dg.removeEdge(key, target.id)
          })
          delete this.nodeMap[key]
        })
    }
  }

  removeNodes(ids: string[]) {
    ids.forEach((id) => this.removeNode(id))
  }

  layout() {
    this.nodes
      .filter((node) => node.isAreaBegin)
      .forEach((node) => {
        this.dg.setNode(node.id, {
          width: node.areaWidth,
          height: node.height,
        })
      })
    dagre.layout(this.dg)
    const posXMid = this.dg.node('start').x
    this.dg.nodes().forEach((nodeId) => {
      const pos = this.dg.node(nodeId)
      if (this.nodeMap[nodeId]) {
        if (this.nodeMap[nodeId].component === 'ExtendNode') {
          this.nodeMap[nodeId].setPostion(
            pos.x - this.standardSize / 2 - posXMid + this.centerX,
            pos.y + this.standardSize
          )
        } else {
          if (
            this.nodes.some(
              (node) =>
                this.nodeMap[node.id].component === 'ExtendNode' &&
                node.targets?.some((target) => target.id === nodeId)
            )
          ) {
            this.nodeMap[nodeId].setPostion(
              pos.x - this.nodeSize / 2 - posXMid + this.centerX,
              pos.y
            )
          } else {
            this.nodeMap[nodeId].setPostion(
              pos.x - this.nodeSize / 2 - posXMid + this.centerX,
              pos.y
            )
          }
        }
      }
    })
  }

  getNode(id: string) {
    return this.nodeMap[id]
  }

  getNextArea(id: string): FlowNode | undefined {
    const nexts = this.nodeMap[id]?.targets
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0].id)
      if (nextNode.isAreaNode) {
        return nextNode
      }
      return this.getNextArea(nextNode.id)
    }
    return undefined
  }

  getNextAreaBegin(id: string, deep = 0): FlowNode | undefined {
    const nexts = this.nodeMap[id]?.targets
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0].id)
      if (nextNode.isAreaBegin) {
        return this.getNextAreaBegin(nextNode.id, deep + 1)
      }
      if (nextNode.isAreaEnd) {
        return deep === 0
          ? nextNode
          : this.getNextAreaBegin(nextNode.id, deep - 1)
      }
      return this.getNextAreaBegin(nextNode.id, deep)
    }
    return undefined
  }

  getNextAreaEnd(id: string, deep = 0): FlowNode | undefined {
    const nexts = this.nodeMap[id]?.targets
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0].id)
      const isAreaEnd = this.nodes.find(
        (node) =>
          nexts &&
          (node.loopEndTarget === nexts[0].id ||
            node.decisionEndTarget === nexts[0].id)
      )
      if (nextNode.isAreaBegin) {
        return this.getNextAreaEnd(nextNode.id, deep + 1)
      }
      if (isAreaEnd) {
        return deep === 0
          ? nextNode
          : this.getNextAreaEnd(nextNode.id, deep - 1)
      }
      return this.getNextAreaEnd(nextNode.id, deep)
    }
    return undefined
  }

  getInnerNodes(begin: FlowNode, end: FlowNode) {
    const node = this.nodeMap[begin.id]
    const innerNodes: FlowNode[] = []
    const nexts = node.nextNodes
    innerNodes.push(...nexts)
    if (
      nexts.some((node) => {
        return node.id === end.id
      })
    ) {
      return Array.from(new Set(innerNodes))
    }
    nexts.forEach((next) => {
      innerNodes.push(...this.getInnerNodes(next, end))
    })
    return Array.from(new Set(innerNodes))
  }

  layoutData() {
    this.layout()
    return {
      nodes: this.nodes.filter((node) => node.type !== 'shadow'),
      edges: this.dg
        .edges()
        .filter((edge) => !this.shadowNodes.some((node) => edge.w === node.id))
        .map((edge) => {
          if (this.shadowNodes.some((node) => edge.v === node.id)) {
            const origin = this.nodes.find((node) => node.shadowNode === edge.v)
            return { ...edge, v: origin?.id as string }
          }
          return edge
        }),
    }
  }
}
