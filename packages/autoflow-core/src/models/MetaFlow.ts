import { isArr, uid } from '@toy-box/toybox-shared'
import { define, observable, action, batch } from '@formily/reactive'
import { Flow } from '@toy-box/flow-graph'
import {
  FlowMetaType,
  FlowMetaParam,
  FlowType,
  IFlowMeta,
  IFlowMetaNodes,
  FlowMetaUpdate,
  StartFlowMetaUpdate,
} from '../types'
import {
  FlowStart,
  FlowDecision,
  FlowLoop,
  FlowMetaNode,
  FlowAssignment,
  FlowEnd,
} from './flow-nodes'

export enum MetaFieldType {
  EDIT = 'EDIT',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  INIT = 'INIT',
}

export enum FlowModeEnum {
  EDIT = 'edit',
  READ = 'read',
}

export type FlowModeType = FlowModeEnum.EDIT | FlowModeEnum.READ

export type FlowMetaParamOfType = FlowMetaParam

export class MetaFlow {
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

  get flowMetaNodes() {
    return Object.keys(this.flowMetaNodeMap).map(
      (key) => this.flowMetaNodeMap[key]
    )
  }

  constructor(mode: FlowModeType, flow?: Flow) {
    this.mode = mode || this.mode
    this.flow = flow ?? new Flow()
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      flowMetaNodeMap: observable.deep,
      flowMetaNodes: observable.computed,
      flow: observable.ref,
      mode: observable.ref,
      flowType: observable.ref,
      setMetaFlow: batch,
      getFlowMetaNodeMap: batch,
      removeNodeWithBind: batch,
      updateNode: batch,
      appendNode: batch,
      addNode: batch,
      mountNodes: batch,
    })
  }
  get flowGraph() {
    return this.flow.flowGraph
  }

  get flowNodes() {
    return this.flow.flowGraph.nodes
  }

  get flowNodeMap() {
    return this.flow.flowGraph.nodeMap
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
    this.mountNodes(this.metaFlowDatas)
  }

  getFlowMetaNodeMap(nodeMap: Record<string, FlowMetaNode> = {}) {
    this.flowMetaNodeMap = nodeMap
  }

  parseFlow(nodes: IFlowMetaNodes) {
    const flowMetaPrarms: FlowMetaParam[] = []
    for (const key in nodes) {
      if (isArr(nodes[key])) {
        flowMetaPrarms.push(...nodes[key].map())
      } else {
        flowMetaPrarms.push(nodes[key])
      }
    }
    return flowMetaPrarms
  }

  removeNodeWithBind(id: string) {
    const flowNode = this.flow.getFlowNode(id)
    flowNode.bindNodes.forEach((node) => {
      if (node.type !== 'extend') {
        delete this.flowMetaNodeMap[node.id]
      }
    })
    this.flow.removeNode(id)
  }

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

  addNode(flowData: FlowMetaParam) {
    const flowNode = this.makeFlowNode(flowData)
    this.flowMetaNodeMap[flowNode.id] = flowNode
    this.flow.addGraphNode({ ...flowData, data: flowNode })
  }

  mountNodes(flowDatas: FlowMetaParam[], parent?: FlowMetaNode) {
    if (flowDatas.length === 0) {
      return
    }
    if (parent == null) {
      const start = flowDatas.find((data) => data.type === FlowMetaType.START)
      const startNode = this.makeFlowNode(start)
      this.flowMetaNodeMap[startNode.id] = startNode
      startNode.appendAt(undefined)
      this.mountNodes(
        flowDatas.filter((data) => data.id !== start.id),
        startNode
      )
    } else {
      switch (parent.type) {
        case FlowMetaType.END:
          return
        case FlowMetaType.LOOP: {
          // next
          const nextValueRef = (parent as FlowLoop).nextValueConnector
            ?.targetReference
          const nextValueData = flowDatas.find(
            (data) => data.id === nextValueRef
          )
          const nextValueNode = this.makeFlowNode(nextValueData)
          // edit mode
          const nextAtNode = this.flowNodes.find(
            (node) => (node.id = this.flowNodeMap[parent.id].targets[0].id)
          )
          this.flowMetaNodeMap[nextValueNode.id] = nextValueNode
          nextValueNode.appendAt(nextAtNode)
          this.mountNodes(
            flowDatas.filter((data) => data.id !== nextValueRef),
            nextValueNode
          )
          // defaultConnector
          const targetRef = (parent as FlowLoop).defaultConnector
            ?.targetReference
          const currentData = flowDatas.find((data) => data.id === targetRef)
          const currentNode = this.makeFlowNode(currentData)
          // edit mode
          const atNode = this.flowNodes.find(
            (node) => (node.id = this.flowNodeMap[parent.id].loopEndTarget)
          )
          this.flowMetaNodeMap[currentNode.id] = currentNode
          currentNode.appendAt(atNode)
          this.mountNodes(
            flowDatas.filter((data) => data.id !== targetRef),
            currentNode
          )
          return
        }
        case FlowMetaType.DECISION: {
          if (parent instanceof FlowDecision) {
            parent.commRules.forEach((rule) => {
              const currentData = flowDatas.find(
                (data) => data.id === rule.connector.targetReference
              )
              const currentNode = this.makeFlowNode(currentData)
              // edit mode
              const atNode = this.flowNodes.find(
                (node) => (node.id = this.flowNodeMap[rule.id].targets[0].id)
              )
              this.flowMetaNodeMap[currentNode.id] = currentNode
              currentNode.appendAt(atNode)
              this.mountNodes(
                flowDatas.filter(
                  (data) =>
                    !parent.commRules.some(
                      (rule) => rule.connector?.targetReference === data.id
                    ) && parent.defaultConnector.targetReference !== data.id
                ),
                currentNode
              )
            })
          }
          return
        }
        default:
          const targetRef = parent.lowerLeverConnector?.targetReference
          const currentData = flowDatas.find((data) => data.id === targetRef)
          const currentNode = this.makeFlowNode(currentData)
          // edit mode
          const atNode = this.flowNodes.find(
            (node) => node.id === this.flowNodeMap[parent.id].targets[0].id
          )
          this.flowMetaNodeMap[currentNode.id] = currentNode
          currentNode.appendAt(atNode)
          this.mountNodes(
            flowDatas.filter((data) => data.id !== targetRef),
            currentNode
          )
          return
      }
    }
  }

  makeFlowNode(node: FlowMetaParam): FlowMetaNode {
    console.log('makeFlowNode', node)
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
      default:
        return
    }
  }
}
