import { define, observable, action } from '@formily/reactive'
import {
  FlowNode,
  TargetProps,
  IFlowNodeProps,
  LayoutModeEnum,
} from '@toy-box/flow-graph'
import { uid } from '@toy-box/toybox-shared'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'
import {
  FlowMetaParam,
  FlowMetaParamWithSize,
  FlowMetaType,
  FlowMetaUpdate,
  TargetReference,
} from '../../types'
import { FreeFlow } from '../FreeFlow'

export class FlowLoop extends FlowMetaNode {
  defaultConnector?: TargetReference
  defaultConnectorName?: string
  nextValueConnector?: TargetReference
  collectionReference?: string
  iterationOrder?: string

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'LoopNode',
  }

  get type() {
    return FlowMetaType.LOOP
  }

  get nextNodes() {
    return this.metaFlow.flowMetaNodes.filter(
      (node) => node.id === this.defaultConnector.targetReference
    )
  }

  get loopBackNode() {
    return this.findLoopBack()
  }

  get parents() {
    return this.metaFlow.flowMetaNodes.filter((node) =>
      node.nextNodes.some(
        (next) => next.id === this.id && next.id !== this.loopBackNode.id
      )
    )
  }

  get lowerLeverConnector() {
    return this.nextValueConnector
  }

  get nextValueConnectorName() {
    return 'For Each Item'
  }

  constructor(flowLoop: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(metaFlow, flowLoop.id, flowLoop.name, flowLoop.description)
    this.defaultConnector = flowLoop.defaultConnector ?? {
      targetReference: '',
    }
    this.nextValueConnector = flowLoop.nextValueConnector ?? {
      targetReference: '',
    }
    this.defaultConnectorName =
      flowLoop.defaultConnectorName ?? 'After Last Item'
    // this.nextValueConnectorName =
    //   flowLoop.nextValueConnectorName ?? 'For Each Item'
    this.collectionReference = flowLoop.collectionReference
    this.iterationOrder = flowLoop.iterationOrder
    this.description = flowLoop.description
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      defaultConnector: observable.deep,
      defaultConnectorName: observable.ref,
      nextValueConnector: observable.deep,
      collectionReference: observable.ref,
      iterationOrder: observable.ref,
      update: action,
    })
  }

  makeFlowNode(
    {
      width,
      height,
      x,
      y,
      component,
    }: IMakeFlowNodeProps = FlowLoop.DefaultNodeProps
  ): IFlowNodeProps {
    const targets = []
    const nextConId = this?.nextValueConnector.targetReference
    if (nextConId)
      targets.push({ id: nextConId, label: this.nextValueConnectorName })
    const defaultConId = this.defaultConnector.targetReference
    if (defaultConId)
      targets.push({ id: defaultConId, label: this.defaultConnectorName })
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'loopBegin',
      width,
      height,
      x,
      y,
      targets:
        this.metaFlow.layoutMode === LayoutModeEnum.AUTO_LAYOUT
          ? [this.nextValueConnector.targetReference]
          : targets,
      loopEndTarget: this.defaultConnector.targetReference,
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
    }: IMakeFlowNodeProps = FlowLoop.DefaultNodeProps,
    targets: TargetProps[]
  ): IFlowNodeProps[] {
    const extendId = uid()
    const loopEndId = uid()
    return [
      {
        id: this.id,
        label: this.name,
        data: this,
        type: 'loopBegin',
        width,
        height,
        x,
        y,
        targets: [extendId],
        loopBackTarget: extendId,
        loopEndTarget: loopEndId,
        component,
      },
      {
        id: extendId,
        type: 'extend',
        targets: [loopEndId],
        ...FlowMetaNode.ExtendNodeProps,
      },
      {
        id: loopEndId,
        type: 'extend',
        targets: targets,
        ...FlowMetaNode.ExtendNodeProps,
      },
    ]
  }

  appendAt(at: FlowNode): void {
    if (this.flowNode == null) {
      if (at.isLoopBack) {
        this.defaultConnector.targetReference = at.loopBegin.id
      } else {
        this.defaultConnector.targetReference = at.targets[0].id
      }
      const flowNodes = this.makeFlowNodeWithExtend(
        FlowLoop.DefaultNodeProps,
        at.targets
      )
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
      this.metaFlow.flow.addFlowNode(flowNodes[1])
      this.metaFlow.flow.addFlowNode(flowNodes[2])
    }
  }

  appendFreeAt(flowData: FlowMetaParamWithSize) {
    const nodeProps = {
      x: flowData.x,
      y: flowData.y,
      width: flowData.width || FlowLoop.DefaultNodeProps.width,
      height: flowData.height || FlowLoop.DefaultNodeProps.height,
      component: FlowLoop.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update = (flowLoop: FlowMetaUpdate) => {
    this.name = flowLoop.name
    this.collectionReference = flowLoop.collectionReference
    this.iterationOrder = flowLoop.iterationOrder
    this.description = flowLoop.description
    this.toJson()
  }

  updateConnector(
    targetId: string,
    options: 'nextValueConnector' | 'defaultConnector'
  ): void {
    this[options] = { targetReference: targetId }
    this.toJson()
  }

  deleteConnector(target, nodeTarget) {
    if (
      this.defaultConnector.targetReference === target &&
      nodeTarget.label === this.defaultConnectorName
    ) {
      this.defaultConnector = { targetReference: '' }
    } else {
      this.nextValueConnector = { targetReference: '' }
    }
    this.toJson()
  }

  toJson = (): FlowMetaParam => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      nextValueConnector: this.nextValueConnector,
      defaultConnector: this.defaultConnector,
      collectionReference: this.collectionReference,
      iterationOrder: this.iterationOrder,
    }
  }
}
