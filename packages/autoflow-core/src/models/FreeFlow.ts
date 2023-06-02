import { isArr, uid } from '@toy-box/toybox-shared'
import { define, observable, action, batch } from '@formily/reactive'
import { Flow, LayoutModeEnum, FlowModeEnum } from '@toy-box/flow-graph'
import { NodeChange } from 'reactflow'
import {
  FlowMetaType,
  FlowMetaParam,
  FlowType,
  IFlowMeta,
  IFlowMetaNodes,
  FlowMetaUpdate,
  StartFlowMetaUpdate,
  FlowMetaParamWithSize,
  IRecordObject,
} from '../types'
import {
  FlowStart,
  FlowDecision,
  FlowLoop,
  FlowWait,
  FlowSortCollectionProcessor,
  FlowMetaNode,
  FlowAssignment,
  FlowEnd,
  FlowRecordCreate,
  FlowRecordUpdate,
  FlowRecordLookup,
  FlowRecordDelete,
  FlowHttpCall,
} from './flow-nodes'

import { History, OpearteTypeEnum } from './History'
import { AutoFlow } from './AutoFlow'
import { FlowShortcut } from './flow-nodes/FlowShortcut'

enum MetaFieldType {
  EDIT = 'EDIT',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  INIT = 'INIT',
}

type FlowModeType = FlowModeEnum.EDIT | FlowModeEnum.READ

export class FreeFlow extends AutoFlow {
  // disposers: (() => void)[] = []
  // flowMeta: IFlowMeta
  // metaFlowDatas: FlowMetaParam[] = []
  // metaResourceDatas: IResourceParam[] = []
  // flowMetaNodeMap: Record<string, FlowMetaNode> = {}
  // flowResourceMap: Record<string, FlowVariable> = {}
  // flowConstantMap: Record<string, IFieldMeta> = {}
  // flowFormulaMap: Record<string, IFieldMeta> = {}
  // flowTemplateMap: Record<string, IFieldMeta> = {}
  // flowVariableMap: Record<string, IFieldMeta> = {}

  // flowConstants: IFieldMeta[] = []
  // flowFormulas: IFieldMeta[] = []
  // flowTemplates: IFieldMeta[] = []
  // flowVariables: IFieldMeta[] = []
  // mode: FlowModeType = FlowModeEnum.EDIT
  // flowType: FlowType
  // history: History
  // layoutMode?: LayoutModeEnum
  // flowFree: FlowFree

  get flowMetaNodes() {
    return Object.keys(this.flowMetaNodeMap).map(
      (key) => this.flowMetaNodeMap[key]
    )
  }

  constructor(mode: FlowModeType, flow?: Flow, layoutMode?: LayoutModeEnum) {
    super(mode, (layoutMode = layoutMode || LayoutModeEnum.FREE_LAYOUT), flow)

    this.history = new History(undefined, {
      onRedo: (item) => {
        console.log(item, 'onRedo')
        switch (item.type) {
          case OpearteTypeEnum.ADD_NODE:
            // this.flowMetaNodeMap = item.updateMetaNodeMap
            item.flowNode.appendFreeAt(item.flowNode)
            break
          case OpearteTypeEnum.UPDATE_NODE:
            // this.flowMetaNodeMap = item.updateMetaNodeMap
            const flowNode = item.flowNode.makeFlowNode()
            this.flow.updateFreeNode(flowNode)
            break
          case OpearteTypeEnum.REMOVE_NODE:
            // this.flowMetaNodeMap = item.updateMetaNodeMap
            if (item?.edges?.length > 0) {
              const edges: any = item?.edges?.map((edge) => {
                return {
                  id: edge.id,
                  type: 'remove',
                }
              })
              this.flow.canvas.onEdgesChange({
                changes: edges,
                freeFlow: this,
                isHistory: true,
              })
            }
            this.flow.canvas.onNodesChange({
              changes: [
                {
                  id: item.flowNode.id,
                  type: 'remove',
                },
              ],
              freeFlow: this,
              isHistory: true,
            })
            break
          case OpearteTypeEnum.ADD_EDGE:
            // this.flowMetaNodeMap = item.updateMetaNodeMap
            item.edges.forEach((edge) => {
              const sourceNode = this.flowMetaNodeMap[edge.source]
              this.flow.canvas.onConnect({
                connection: edge as any,
                sourceFlowmetaNode: sourceNode,
                freeFlow: this,
                isHistory: true,
                edge,
              })
            })
            break
          case OpearteTypeEnum.REMOVE_EDGE:
            // this.flowMetaNodeMap = item.updateMetaNodeMap
            const edges: any = item.edges.map((edge) => {
              return {
                id: edge.id,
                type: 'remove',
              }
            })
            this.flow.canvas.onEdgesChange({
              changes: edges,
              freeFlow: this,
              isHistory: true,
              edges,
            })
            break
          default:
            break
        }
      },
      onUndo: (item) => {
        console.log(item, 'onUndo')
        switch (item.type) {
          case OpearteTypeEnum.ADD_NODE:
            this.flowMetaNodeMap = item.flowMetaNodeMap
            this.flow.canvas.onNodesChange({
              changes: [
                {
                  id: item.flowNode.id,
                  type: 'remove',
                },
              ],
              freeFlow: this,
              isHistory: true,
            })
            break
          case OpearteTypeEnum.UPDATE_NODE:
            this.flowMetaNodeMap = item.flowMetaNodeMap
            const flowNode = item.flowNode.makeFlowNode()
            this.flow.updateFreeNode(flowNode)
            break
          case OpearteTypeEnum.REMOVE_NODE:
            this.flowMetaNodeMap = item.flowMetaNodeMap
            item.flowNode.appendFreeAt(item.flowNode)
            item?.edges?.forEach((edge) => {
              const sourceNode = this.flowMetaNodeMap[edge.source]
              this.flow.canvas.onConnect({
                connection: edge as any,
                sourceFlowmetaNode: sourceNode,
                freeFlow: this,
                isHistory: true,
                edge,
              })
            })
            break
          case OpearteTypeEnum.ADD_EDGE:
            this.flowMetaNodeMap = item.flowMetaNodeMap
            const edges: any = item.edges.map((edge) => {
              return {
                id: edge.id,
                type: 'remove',
              }
            })
            this.flow.canvas.onEdgesChange({
              changes: edges,
              freeFlow: this,
              isHistory: true,
            })
            break
          case OpearteTypeEnum.REMOVE_EDGE:
            this.flowMetaNodeMap = item.flowMetaNodeMap
            item.edges.forEach((edge) => {
              const sourceNode = this.flowMetaNodeMap[edge.source]
              this.flow.canvas.onConnect({
                connection: edge as any,
                sourceFlowmetaNode: sourceNode,
                freeFlow: this,
                isHistory: true,
                edge,
              })
            })
            break
          default:
            break
        }
      },
    })

    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      flowMetaNodeMap: observable.deep,
      flowResourceMap: observable.deep,
      history: observable.deep,
      metaResourceDatas: observable.deep,
      shortCutDatas: observable.deep,
      flowMetaNodes: observable.computed,
      flow: observable.ref,
      // flowFree: observable.ref,
      mode: observable.ref,
      flowType: observable.ref,
      layoutMode: observable.ref,
      recordObject: observable.deep,
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
      createResource: action,
      editResource: action,
      changeMode: action,
      shortCutPush: action,
      initShortCuts: action,
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
      return { ...node.toJson(), ...node.position }
    })
  }

  get toVarJsonList() {
    // return this.metaResourceDatas.map((node) => {
    //   return {
    //     children: node.children.map((child: any) => {
    //       return { ...child.toJson() }
    //     }),
    //     ...node
    //   }
    // })
    const varNodes = []
    for (const key in this.flowResourceMap) {
      if (Object.prototype.hasOwnProperty.call(this.flowResourceMap, key)) {
        const data = this.flowResourceMap[key]
        varNodes.push(data.toJson())
      }
    }
    return varNodes
  }

  setMetaFlow(
    flowMeta: IFlowMeta,
    flowType: FlowType,
    recordObject?: IRecordObject,
    layoutMode?: LayoutModeEnum
  ) {
    this.flowMeta = flowMeta
    this.flowType = flowType
    this.recordObject = recordObject
    // this.layoutMode = layoutMode
    this.onInitResource(this.flowMeta.resources)
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
    const flowMetaNodeMap = { ...this.flowMetaNodeMap }
    this.flowMetaNodeMap[flowNode.id] = flowNode
    this.metaFlowDatas.push(flowData)
    this.history.push({
      type: OpearteTypeEnum.ADD_NODE,
      flowNode,
      flowMetaNodeMap,
      updateMetaNodeMap: this.flowMetaNodeMap,
    })
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
            name: node.name ?? 'start',
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
      case FlowMetaType.WAIT:
        return new FlowWait(node, this)
      case FlowMetaType.SORT_COLLECTION_PROCESSOR:
        return new FlowSortCollectionProcessor(node, this)
      case FlowMetaType.END:
        return new FlowEnd(node, this)
      case FlowMetaType.RECORD_CREATE:
        return new FlowRecordCreate(node, this)
      case FlowMetaType.RECORD_UPDATE:
        return new FlowRecordUpdate(node, this)
      case FlowMetaType.RECORD_LOOKUP:
        return new FlowRecordLookup(node, this)
      case FlowMetaType.RECORD_DELETE:
        return new FlowRecordDelete(node, this)
      case FlowMetaType.HTTP_CALL:
        return new FlowHttpCall(node, this)
      case FlowMetaType.SHORT_CUT:
        return new FlowShortcut(node as any, this)
      default:
        return
    }
  }

  addEdge(connection) {
    const sourceNode = this.flowMetaNodeMap[connection.source]
    this.flow.canvas.onConnect({
      connection,
      sourceFlowmetaNode: sourceNode,
      freeFlow: this,
    })
  }

  updateEdges(changes) {
    this.flow.canvas.onEdgesChange({ changes, freeFlow: this })
  }

  changeNodes(changes: NodeChange[]) {
    if (this.flow?.canvas)
      this.flow?.canvas?.onNodesChange({ changes, freeFlow: this })
  }

  changeMode() {
    const goEditFlag = this.mode === FlowModeEnum.READ
    this.mode = goEditFlag ? FlowModeEnum.EDIT : FlowModeEnum.READ
    this.flow.canvas.nodes.map((node) => {
      node.deletable = goEditFlag
      node.draggable = goEditFlag
      node.selected = false
    })
    this.flow.canvas.edges.map((edge) => {
      edge.deletable = goEditFlag
      edge.selected === true &&
        this.updateEdges([{ id: edge.id, type: 'select', selected: false }])
    })
  }
}
