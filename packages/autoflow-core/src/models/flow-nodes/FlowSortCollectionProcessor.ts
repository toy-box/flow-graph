import { define, observable, action } from '@formily/reactive'
import { FlowNode, TargetProps } from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaUpdate,
  TargetReference,
  FlowMetaType,
  FlowMetaParamWithSize,
  SortOption,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowSortCollectionProcessor extends FlowMetaNode {
  connector?: TargetReference
  collectionReference?: string
  limit?: null | number
  sortOptions?: SortOption[]

  static DefaultNodeProps = {
    width: 60,
    height: 60,
    component: 'SortCollectionNode',
  }

  get type() {
    return FlowMetaType.SORT_COLLECTION_PROCESSOR
  }

  get lowerLeverConnector() {
    return this.connector
  }

  constructor(sortCollection: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      sortCollection.id,
      sortCollection.name,
      sortCollection.description
    )
    this.connector = sortCollection.connector ?? {
      targetReference: null,
    }
    this.collectionReference = sortCollection.collectionReference
    this.limit = sortCollection.limit
    this.sortOptions = sortCollection.sortOptions
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      description: observable.ref,
      limit: observable.ref,
      collectionReference: observable.ref,
      connector: observable.deep,
      sortOptions: observable.deep,
      update: action,
    })
  }

  get nextNodes() {
    return this.metaFlow.flowMetaNodes.filter(
      (node) => node.id === this.connector.targetReference
    )
  }

  makeFlowNode(
    {
      width,
      height,
      x,
      y,
      component,
    }: IMakeFlowNodeProps = FlowSortCollectionProcessor.DefaultNodeProps
  ): IFlowNodeProps {
    const conId = this?.connector?.targetReference
    const targets = []
    if (conId) targets.push(conId)
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'forward',
      width,
      height,
      x,
      y,
      targets: targets,
      component,
    }
  }

  makeFlowNodeWithExtend(
    {
      width,
      height,
      x,
      y,
      component,
    }: IMakeFlowNodeProps = FlowSortCollectionProcessor.DefaultNodeProps,
    targets: TargetProps[]
  ): IFlowNodeProps[] {
    const extendId = uid()
    return [
      {
        id: this.id,
        label: this.name,
        data: this,
        type: 'forward',
        width,
        height,
        x,
        y,
        targets: [extendId],
        component,
      },
      {
        id: extendId,
        data: this,
        type: 'extend',
        x,
        y,
        targets,
        ...FlowMetaNode.ExtendNodeProps,
      },
    ]
  }

  appendAt(at: FlowNode) {
    if (this.flowNode == null) {
      if (at.isLoopBack) {
        this.connector.targetReference = at.loopBegin.id
      } else {
        this.connector.targetReference = at.targets[0].id
      }
      const flowNodes = this.makeFlowNodeWithExtend(
        FlowSortCollectionProcessor.DefaultNodeProps,
        at.targets
      )
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
      this.metaFlow.flow.addFlowNode(flowNodes[1])
    }
    this.toJson()
  }

  appendFreeAt(flowData: FlowMetaParamWithSize) {
    this.x = flowData.x
    this.y = flowData.y
    const nodeProps = {
      x: flowData.x,
      y: flowData.y,
      width:
        flowData.width || FlowSortCollectionProcessor.DefaultNodeProps.width,
      height:
        flowData.height || FlowSortCollectionProcessor.DefaultNodeProps.height,
      component: FlowSortCollectionProcessor.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update = (payload: FlowMetaUpdate) => {
    this.name = payload.name
    this.description = payload.description
    this.collectionReference = payload.collectionReference
    this.limit = payload.limit
    this.sortOptions = payload.sortOptions
    this.toJson()
  }

  updateConnector = (targetId: string) => {
    this.connector = { targetReference: targetId }
    this.toJson()
  }

  deleteConnector() {
    this.connector = { targetReference: null }
    this.toJson()
  }

  toJson = (): FlowMetaParam => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      connector: this.connector,
      collectionReference: this.collectionReference,
      limit: this.limit,
      sortOptions: this.sortOptions,
      x: this.x,
      y: this.y,
    }
  }
}
