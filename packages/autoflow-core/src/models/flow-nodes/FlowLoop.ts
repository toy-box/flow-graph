import { define, observable, action } from '@formily/reactive'
import { TargetProps } from '@toy-box/flow-graph'
import { FlowNode, IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import { FlowMetaParam, FlowMetaType, TargetReference } from '../../types'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowLoop extends FlowMetaNode {
  connector?: TargetReference
  defaultConnector?: TargetReference
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

  constructor(flowLoop: FlowMetaParam, metaFlow: MetaFlow) {
    super(metaFlow, flowLoop.id, flowLoop.name, flowLoop.description)
    this.connector = flowLoop.connector
    this.defaultConnector = flowLoop.defaultConnector
    this.nextValueConnector = flowLoop.nextValueConnector
    this.collectionReference = flowLoop.collectionReference
    this.iterationOrder = flowLoop.iterationOrder
    this.description = flowLoop.description
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      connector: observable.deep,
      defaultConnector: observable.deep,
      nextValueConnector: observable.deep,
      collectionReference: observable.ref,
      iterationOrder: observable.ref,
      onEdit: action,
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
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'begin',
      width,
      height,
      x,
      y,
      targets: [this.nextValueConnector.targetReference],
      loopEndTarget: this.connector.targetReference,
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
        type: 'begin',
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
        width: FlowMetaNode.StandardSize,
        height: FlowMetaNode.StandardSize,
        targets: [loopEndId],
      },
      {
        id: loopEndId,
        type: 'extend',
        width: FlowMetaNode.StandardSize,
        height: FlowMetaNode.StandardSize,
        targets: targets,
      },
    ]
  }

  appendAt(at: FlowNode): void {
    if (this.flowNode == null) {
      this.connector.targetReference = at.targets[0].id
      const flowNodes = this.makeFlowNodeWithExtend(
        FlowLoop.DefaultNodeProps,
        at.targets
      )
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
      this.metaFlow.flow.addFlowNode(flowNodes[1])
    }
  }

  onEdit = (flowLoop: FlowMetaParam) => {
    this.id = flowLoop.id
    this.name = flowLoop.name
    this.connector = flowLoop.connector
    this.defaultConnector = flowLoop.defaultConnector
    this.nextValueConnector = flowLoop.nextValueConnector
    this.collectionReference = flowLoop.collectionReference
    this.iterationOrder = flowLoop.iterationOrder
    this.description = flowLoop.description
  }
}
