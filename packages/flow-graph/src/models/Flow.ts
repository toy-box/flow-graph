import { action, batch, define, observable } from '@formily/reactive'
import { uid } from '@toy-box/toybox-shared'
import { FlowGraph } from './FlowGraph'
import { IConnectionWithLabel, ReactFlowCanvas } from '../canvas'
import { FlowNode, IFlowNodeProps } from './FlowNode'
import { IEdge, LayoutModeEnum } from '../types'
import { freeEdgeOptions } from '../edges'

const getAreaWidth = (start: FlowNode, end: FlowNode) => {
  return Math.max(start.areaWidth, end.areaWidth)
}

export type UpdateNodeProps = Partial<
  Pick<
    IFlowNodeProps,
    'targets' | 'decisionEndTarget' | 'loopEndTarget' | 'data'
  >
> & {
  id: string
}
export interface IFlowBatch {
  addNodesAt?: Array<{
    id: string
    node: IFlowNodeProps
  }>
  addNodes?: IFlowNodeProps[]
  removeNodes?: string[]
  updateNodes?: UpdateNodeProps[]
}

export class Flow {
  id: string
  flowGraph: FlowGraph
  canvas?: ReactFlowCanvas
  layoutMode?: LayoutModeEnum

  constructor(layoutMode?: LayoutModeEnum) {
    this.id = uid()
    this.flowGraph = new FlowGraph({
      standardSize: 20,
    })
    this.layoutMode = layoutMode || LayoutModeEnum.FREE_LAYOUT
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      id: observable.ref,
      flowGraph: observable.ref,
      canvas: observable.ref,
      layoutMode: observable.ref,
      setCanvas: batch,
      addFlowNodeAt: batch,
      addFlowNode: action,
      addFlowFreeNode: action,
      // addFlowFreeNodes: action,
      addFlowNodes: action,
      addGraphNode: action,
      updateNode: action,
      removeNode: action,
      removeNodes: action,
      addGraphEdge: action,
      addGraphEdges: batch,
      setFlowNodes: batch,
      layoutFlow: batch,
    })
  }
  setCanvas(canvas: ReactFlowCanvas) {
    console.log('canvas', canvas)
    this.canvas = canvas
  }

  getFlowNode(id: string) {
    return this.flowGraph.getNode(id)
  }

  layoutFlow() {
    if (this.canvas) {
      console.log('this.flowGraph.layoutData', this.flowGraph.layoutData())
      const layout = this.flowGraph.layoutData()
      this.setGraphNodes(layout.nodes)
      const edges: IEdge[] = []
      layout.edges.map((edge) => {
        const sourceNode = this.flowGraph.getNode(edge.v)
        const targetNode = this.flowGraph.getNode(edge.w)
        if (sourceNode.isLoopBack && targetNode.isLoopEnd) {
          const loopBegin = sourceNode.loopBegin as FlowNode
          // Loop cycle edge
          edges.push({
            source: sourceNode.id,
            target: loopBegin.id,
            label: 'Loop cycle',
            sourceHandle: 'bottom',
            targetHandle: 'left',
            data: {
              targetXSet: -getAreaWidth(sourceNode, loopBegin) / 2,
            },
          })
          edges.push({
            source: loopBegin.id,
            target: targetNode.id,
            label: 'Loop out',
            sourceHandle: 'right',
            targetHandle: 'top',
            data: {
              sourceXSet: getAreaWidth(loopBegin, targetNode) / 2,
            },
          })
        } else if (sourceNode.isDecisionBegin || targetNode.isDecisionEnd) {
          const target = sourceNode.targets?.find(
            (tg) => tg.id === targetNode.id
          )
          edges.push({
            source: edge.v,
            target: edge.w,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'forkEdge',
            label: target?.label,
            data: {
              fork: sourceNode.isDecisionBegin,
            },
          })
        } else {
          edges.push({
            source: edge.v,
            target: edge.w,
            sourceHandle: 'bottom',
            targetHandle: 'top',
          })
        }
      })
      this.setGraphEdges(edges)
    }
  }

  addFlowNodeAt(id: string, node: IFlowNodeProps) {
    this.flowGraph.addNodeAt(id, node)
  }

  addFlowNode(node: IFlowNodeProps) {
    return this.flowGraph.addNode(node)
  }

  // addFlowFreeNodes(nodes: IFlowNodeProps[]) {
  //   nodes.map((node) => {
  //     if (this.layoutMode === LayoutModeEnum.FREE_LAYOUT) {
  //       if (node?.targets?.length === 0 || !node?.targets) return
  //       node.targets.forEach((target) => {
  //         const connection: Connection = {
  //           ...freeEdgeOptions,
  //           source: node.id,
  //           target: typeof target === 'string' ? target : target.id,
  //           sourceHandle: null,
  //           targetHandle: null,
  //         }
  //         // this.canvas.onConnect(connection, node)
  //         this.canvas.addEdge(connection)
  //       })
  //     }
  //   })
  // }

  addFlowFreeNode(node: IFlowNodeProps) {
    const freeNode = this.flowGraph.addFreeNode(node)
    this.canvas?.addNode(freeNode)
    if (this.layoutMode === LayoutModeEnum.FREE_LAYOUT) {
      if (freeNode?.targets?.length === 0 || !node?.targets) return
      freeNode.targets.forEach((target) => {
        const connection: IConnectionWithLabel = {
          ...freeEdgeOptions,
          source: node.id,
          target: target.id,
          sourceHandle: null,
          targetHandle: null,
          label: target?.label,
        }
        // this.canvas.onConnect(connection, node)
        const edgeId = target?.edgeId
        this.canvas.addEdge(connection, edgeId)
      })
    }
  }

  addFlowNodes(nodes: IFlowNodeProps[]) {
    return this.flowGraph.addNodes(nodes)
  }

  updateNode(nodeUpdate: UpdateNodeProps) {
    this.flowGraph.updateNode(nodeUpdate)
  }

  removeNode(id: string) {
    this.flowGraph.removeNode(id)
  }

  removeNodes(ids: string[]) {
    this.flowGraph.removeNodes(ids)
  }

  setFlowNodes(nodes: IFlowNodeProps[]) {
    this.flowGraph.setNodes(nodes)
    this.layoutFlow()
  }

  batch(batchData: IFlowBatch) {
    if (batchData.addNodesAt) {
      batchData.addNodesAt.forEach((data) => {
        this.addFlowNodeAt(data.id, data.node)
      })
    }
    if (batchData.addNodes) {
      this.addFlowNodes(batchData.addNodes)
    }
    if (batchData.removeNodes) {
      this.removeNodes(batchData.removeNodes)
    }
    if (batchData.updateNodes) {
      batchData.updateNodes.forEach((update) => this.updateNode(update))
    }
    this.layoutFlow()
  }

  /// canve graph
  setGraphNodes = (nodes: FlowNode[]) => {
    console.log('set nodes', nodes)
    this.canvas?.setNodes(nodes)
  }

  addGraphNodes = (nodes: FlowNode[]) => {
    this.canvas?.addNodes(nodes)
  }

  addGraphNode = (node: FlowNode) => {
    this.canvas?.addNode(node)
  }

  setGraphEdges = (edges: IEdge[]) => {
    this.canvas?.setEdges(edges)
  }

  addGraphEdge = (edge: IEdge) => {
    this.canvas?.addEdge(edge)
  }

  addGraphEdges = (edges: IEdge[]) => {
    this.canvas?.addEdges(edges)
  }
}
