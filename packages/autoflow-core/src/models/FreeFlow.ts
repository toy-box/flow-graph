import { isArr, uid } from '@toy-box/toybox-shared'
import { define, observable, action, batch } from '@formily/reactive'
import { Flow, LayoutModeEnum } from '@toy-box/flow-graph'
import {
  FlowMetaType,
  FlowMetaParam,
  FlowType,
  IFlowMeta,
  IFlowMetaNodes,
  FlowMetaUpdate,
  StartFlowMetaUpdate,
  FlowMetaParamWithSize,
} from '../types'
import { NodeChange } from 'reactflow'
import {
  FlowStart,
  FlowDecision,
  FlowLoop,
  FlowMetaNode,
  FlowAssignment,
  FlowEnd,
  FlowRecordCreate,
} from './flow-nodes'

enum MetaFieldType {
  EDIT = 'EDIT',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  INIT = 'INIT',
}

enum FlowModeEnum {
  EDIT = 'edit',
  READ = 'read',
}

type FlowModeType = FlowModeEnum.EDIT | FlowModeEnum.READ

type FlowMetaParamOfType = FlowMetaParam

export class FreeFlow {
  disposers: (() => void)[] = []
  flowMeta: IFlowMeta
  metaFlowDatas: FlowMetaParam[] = []
  flow: Flow
  flowMetaNodeMap: Record<string, FlowMetaNode> = {}

  // flowConstants: IFieldMeta[] = []
  // flowFormulas: IFieldMeta[] = []
  // flowTemplates: IFieldMeta[] = []
  // flowVariables: IFieldMeta[] = []
  mode: FlowModeType = FlowModeEnum.EDIT
  flowType: FlowType
  layoutMode?: LayoutModeEnum
  // flowFree: FlowFree

  get flowMetaNodes() {
    return Object.keys(this.flowMetaNodeMap).map(
      (key) => this.flowMetaNodeMap[key]
    )
  }

  constructor(mode: FlowModeType, flow?: Flow, layoutMode?: LayoutModeEnum) {
    this.layoutMode = layoutMode || LayoutModeEnum.FREE_LAYOUT
    this.mode = mode || this.mode
    this.flow = flow ?? new Flow(this.layoutMode)
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      flowMetaNodeMap: observable.deep,
      flowMetaNodes: observable.computed,
      flow: observable.ref,
      // flowFree: observable.ref,
      mode: observable.ref,
      flowType: observable.ref,
      setMetaFlow: batch,
      getFlowMetaNodeMap: batch,
      // removeNodeWithBind: batch,
      updateNode: batch,
      appendNode: batch,
      // addNode: batch,
      // mountNodes: batch,
      addEdge: action,
      updateEdges: action,
      changeNodes: action,
    })
  }
  get flowGraph() {
    return this.flow.flowGraph
  }

  get flowNodes() {
    return this.flowGraph.nodes
  }

  get flowNodeMap() {
    return this.flowGraph.nodeMap
  }

  get editable() {
    return this.mode === FlowModeEnum.EDIT
  }

  get toJsonList() {
    return this.flowMetaNodes.map((node) => {
      return node.toJson()
    })
  }

  setMetaFlow(flowMeta: IFlowMeta, flowType: FlowType) {
    this.flowMeta = flowMeta
    this.flowType = flowType
    this.onInit()
  }

  onInit() {
    this.metaFlowDatas = this.parseFlow(this.flowMeta.nodes)
    // this.mountNodes(this.metaFlowDatas)
    this.metaFlowDatas.forEach((meta) => {
      const currentNode = this.makeFlowNode(meta)
      this.flowMetaNodeMap[currentNode.id] = currentNode
      currentNode.appendFreeAt(meta)
    })
    // this.flow.addFlowFreeNodes(this.flowNodes)
  }

  getFlowMetaNodeMap(nodeMap: Record<string, FlowMetaNode> = {}) {
    this.flowMetaNodeMap = nodeMap
  }

  parseFlow(nodes: IFlowMetaNodes) {
    const flowMetaPrarms: FlowMetaParam[] = []
    for (const key in nodes) {
      if (isArr(nodes[key])) {
        flowMetaPrarms.push(...nodes[key])
      } else {
        flowMetaPrarms.push(nodes[key])
      }
    }
    return flowMetaPrarms
  }

  // removeNodeWithBind(id: string) {
  //   const flowNode = this.flowFree.getFlowNode(id)
  //   flowNode.bindNodes.forEach((node) => {
  //     if (node.type !== 'extend') {
  //       delete this.flowMetaNodeMap[node.id]
  //     }
  //   })
  //   this.flowFree.removeNode(id)
  // }

  updateNode(id: string, payload: FlowMetaUpdate | StartFlowMetaUpdate) {
    const node = this.flowMetaNodeMap[id]
    if (node) {
      node.update(payload)
    }
  }

  appendNode(at: string, flowData: FlowMetaParam) {
    const flowNode = this.makeFlowNode(flowData)
    const parent = this.flowNodes.find((node) => node.id === at)
    this.flowMetaNodeMap[flowNode.id] = flowNode
    flowNode.appendAt(parent)
  }

  // special for drag items in free-layout
  addNode(flowData: FlowMetaParamWithSize) {
    const flowNode = this.makeFlowNode(flowData)
    this.flowMetaNodeMap[flowNode.id] = flowNode
    flowNode.appendFreeAt(flowData)
  }

  mountNodes(flowDatas: FlowMetaParam[], parent?: FlowMetaNode) {
    if (flowDatas.length === 0) {
      return
    }
    if (parent == null) {
      const start = flowDatas.find((data) => data.type === FlowMetaType.START)
      const startNode = this.makeFlowNode(start)
      this.flowMetaNodeMap[startNode.id] = startNode
      startNode.appendFreeAt(start)
      this.mountNodes(
        flowDatas.filter((data) => data.id !== start.id),
        startNode
      )
    } else {
      switch (parent.type) {
        // case FlowMetaType.END:
        //   return
        case FlowMetaType.LOOP: {
          // next
          const nextValueRef = (parent as FlowLoop).nextValueConnector
            ?.targetReference
          const nextValueData = flowDatas.find(
            (data) => data.id === nextValueRef
          )
          if (nextValueData) {
            const nextValueNode = this.makeFlowNode(nextValueData)
            this.flowMetaNodeMap[nextValueNode.id] = nextValueNode
            nextValueNode.appendFreeAt(nextValueData)
            this.mountNodes(
              flowDatas.filter((data) => data.id !== nextValueRef),
              nextValueNode
            )
          }
          // defaultConnector
          const targetRef = (parent as FlowLoop).defaultConnector
            ?.targetReference
          const currentData = flowDatas.find((data) => data.id === targetRef)
          if (currentData) {
            const currentNode = this.makeFlowNode(currentData)
            this.flowMetaNodeMap[currentNode.id] = currentNode
            currentNode.appendFreeAt(currentData)
            this.mountNodes(
              flowDatas.filter((data) => data.id !== targetRef),
              currentNode
            )
          }
          if (!nextValueData && !currentData && flowDatas[0]) {
            const currentNode = this.makeFlowNode(flowDatas[0])
            this.flowMetaNodeMap[currentNode.id] = currentNode
            currentNode.appendFreeAt(flowDatas[0])
            this.mountNodes(
              flowDatas.filter((data, idx) => idx !== 0),
              currentNode
            )
          }
          return
        }
        case FlowMetaType.DECISION: {
          if (parent instanceof FlowDecision) {
            parent.commRules.forEach((rule) => {
              const currentData = flowDatas.find(
                (data) => data.id === rule.connector.targetReference
              )
              if (currentData) {
                const currentNode = this.makeFlowNode(currentData)
                this.flowMetaNodeMap[currentNode.id] = currentNode
                currentNode.appendFreeAt(currentData)
                this.mountNodes(
                  flowDatas.filter(
                    (data) =>
                      !parent.commRules.some(
                        (rule) => rule.connector?.targetReference === data.id
                      ) && parent.defaultConnector.targetReference !== data.id
                  ),
                  currentNode
                )
              } else if (flowDatas[0]) {
                const currentNode = this.makeFlowNode(flowDatas[0])
                this.flowMetaNodeMap[currentNode.id] = currentNode
                currentNode.appendFreeAt(flowDatas[0])
                this.mountNodes(
                  flowDatas.filter((data, idx) => idx !== 0),
                  currentNode
                )
              }
            })
          }
          return
        }
        default:
          const targetRef = parent.lowerLeverConnector?.targetReference
          // todo: template idea
          const currentData = flowDatas.find((data) => data.id === targetRef)
          if (currentData) {
            const currentNode = this.makeFlowNode(currentData)
            this.flowMetaNodeMap[currentNode.id] = currentNode
            currentNode.appendFreeAt(currentData)
            this.mountNodes(
              flowDatas.filter((data) => data.id !== targetRef),
              currentNode
            )
          } else if (flowDatas[0]) {
            const currentNode = this.makeFlowNode(flowDatas[0])
            this.flowMetaNodeMap[currentNode.id] = currentNode
            currentNode.appendFreeAt(flowDatas[0])
            this.mountNodes(
              flowDatas.filter((data, idx) => idx !== 0),
              currentNode
            )
          }
          return
      }
    }
  }

  makeFlowNode(node: FlowMetaParam): FlowMetaNode {
    switch (node.type) {
      case FlowMetaType.START:
        return new FlowStart(
          {
            id: node.id ?? uid(),
            name: 'start',
            flowType: this.flowType,
            connector: node.connector,
          },
          this
        )
      case FlowMetaType.DECISION:
        return new FlowDecision(node, this)
      case FlowMetaType.LOOP:
        return new FlowLoop(node, this)
      case FlowMetaType.ASSIGNMENT:
        return new FlowAssignment(node, this)
      case FlowMetaType.END:
        return new FlowEnd(node, this)
      case FlowMetaType.RECORD_CREATE:
        return new FlowRecordCreate(node, this)
      default:
        return
    }
  }

  addEdge(connection) {
    const sourceNode = this.flowMetaNodeMap[connection.source]
    this.flow.canvas.onConnect(connection, sourceNode)
  }

  updateEdges(changes) {
    this.flow.canvas.onEdgesChange(changes, this.flowMetaNodeMap)
  }

  changeNodes(changes: NodeChange[]) {
    this.flow.canvas.onNodesChange(changes, this)
  }
}
