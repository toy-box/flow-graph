import { define, observable, batch } from '@formily/reactive'
import { IFieldMeta } from '@toy-box/meta-schema'
import { isArr, uid } from '@toy-box/toybox-shared'
import { Flow } from '@toy-box/flow-graph'
import {
  FlowMetaType,
  FlowMetaParam,
  FlowType,
  IFlowMeta,
  IFlowMetaNodes,
} from '../types'
import {
  FlowStart,
  FlowAssignment,
  FlowDecision,
  FlowLoop,
  FlowEnd,
  FlowMetaNode,
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
  flowMetaNodes: FlowMetaNode[]
  // flowStart: FlowStart
  // flowEnd: FlowEnd
  // flowAssignments: FlowAssignment[] = []
  // flowDecisions: FlowDecision[] = []
  // flowLoops: FlowLoop[] = []
  flowConstants: IFieldMeta[] = []
  flowFormulas: IFieldMeta[] = []
  flowTemplates: IFieldMeta[] = []
  flowVariables: IFieldMeta[] = []
  mode: FlowModeType = FlowModeEnum.EDIT
  flowType: FlowType

  constructor(flowMeta: IFlowMeta, flowType: FlowType, mode?: FlowModeType) {
    this.flowMeta = flowMeta
    this.flowType = flowType
    this.mode = mode || this.mode
    this.flow = new Flow()
    // this.makeObservable()
    this.onInit()
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

  // protected makeObservable() {
  //   define(this, {
  //     flow: observable.deep,
  //     flowNodes: observable.computed,
  //     flowConstants: observable.shallow,
  //     flowVariables: observable.shallow,
  //     flowFormulas: observable.shallow,
  //     flowTemplates: observable.shallow,
  //     onInit: batch,
  //   })
  // }

  onInit() {
    this.metaFlowDatas = this.parseFlow(this.flowMeta.nodes)
    this.mountNodes(this.metaFlowDatas)
  }

  parseFlow(nodes: IFlowMetaNodes) {
    const flowMetaNodes: FlowMetaParam[] = []
    for (const key in nodes) {
      if (isArr(nodes[key])) {
        flowMetaNodes.push(...nodes[key].map())
      } else {
        flowMetaNodes.push(nodes[key])
      }
    }
    return flowMetaNodes
  }

  mountNodes(flowDatas: FlowMetaParam[], parent?: FlowMetaNode) {
    if (parent == null) {
      const start = flowDatas.find((data) => data.type === FlowMetaType.START)
      const startNode = this.makeFlowNode(start)
      startNode.appendAt(undefined)
      const remainDatas = flowDatas.filter((data) => data.id !== start.id)
      if (remainDatas.length > 0) {
        this.mountNodes(remainDatas, startNode)
      }
    } else {
      switch (parent.type) {
        case FlowMetaType.DECISION: {
          ;(parent as FlowDecision).rules.forEach((rule) => {
            const currentData = flowDatas.find(
              (data) => data.id === rule.connector.targetReference
            )
            const currentNode = this.makeFlowNode(currentData)
            // edit mode
            const atNode = this.flowNodes.find(
              (node) => (node.id = this.flowNodeMap[rule.id].targets[0].id)
            )
          })
        }
        case FlowMetaType.START: {
          const targetRef = (parent as FlowStart).connector?.targetReference
          const currentData = flowDatas.find((data) => data.id === targetRef)
          const currentNode = this.makeFlowNode(currentData)
          // edit mode
          const atNode = this.flowNodes.find(
            (node) => (node.id = this.flowNodeMap[parent.id].targets[0].id)
          )
          currentNode.appendAt(atNode)
          this.mountNodes(
            flowDatas.filter((data) => data.id !== targetRef),
            currentNode
          )
          return
        }
        default:
          return
      }
    }
  }

  filterFlowData = (
    targetReference: string,
    flowDatas: FlowMetaParam[],
    flowData: FlowMetaParam,
    forkData?: FlowMetaParam
  ) => {
    const filterFlowDatas = flowDatas.filter(
      (data) => data.id !== targetReference
    )
    const flowNode = this.flowNodes.find((node) => node.id === targetReference)
    if (!flowNode && targetReference !== forkData?.connector?.targetReference) {
      this.initFlowNodes(flowData.flowType, flowData, undefined, forkData)
      if (filterFlowDatas.length > 0)
        this.setFlowData(filterFlowDatas, flowData, forkData)
    } else {
      return
    }
    // if (flowNode) {
    //   if (filterFlowDatas.length > 0) this.getFlowData(filterFlowDatas, flowData, forkData);
    // } else {
    //   this.initFlowNodes(flowData.flowType, flowData, undefined, forkData?.id)
    //   if (filterFlowDatas.length > 0) this.setFlowData(filterFlowDatas, flowData, forkData);
    // }
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
      default:
        return
    }
  }
}
