import { define, observable, action } from '@formily/reactive'
import { FlowNode, TargetProps, LayoutModeEnum } from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaUpdate,
  TargetReference,
  IAssignmentData,
  FlowMetaType,
  FlowMetaParamWithSize,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowRecordCreate extends FlowMetaNode {
  connector?: TargetReference
  faultConnector?: TargetReference

  static DefaultConnectorProps = {
    targetReference: '',
  }

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'RecordCreateNode',
  }

  get type() {
    return FlowMetaType.RECORD_CREATE
  }

  get nextNodes() {
    return this.metaFlow.flowMetaNodes.filter(
      (node) => node.id === this.faultConnector.targetReference
    )
  }

  get lowerLeverConnector() {
    return this.connector
  }

  constructor(flowRecordCreate: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      flowRecordCreate.id,
      flowRecordCreate.name,
      flowRecordCreate.description
    )
    this.connector =
      flowRecordCreate.connector ?? FlowRecordCreate.DefaultConnectorProps
    this.faultConnector =
      flowRecordCreate.faultConnector ?? FlowRecordCreate.DefaultConnectorProps
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      connector: observable.deep,
      faultConnector: observable.deep,
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
    }: IMakeFlowNodeProps = FlowRecordCreate.DefaultNodeProps
  ): IFlowNodeProps {
    const targets = []
    const conId = this.connector.targetReference
    if (conId) targets.push({ id: conId })
    const faultConId = this.faultConnector.targetReference
    if (faultConId) targets.push({ id: faultConId, label: 'Fault' })
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
          ? [this.connector.targetReference]
          : targets,
      faultTarget: this.faultConnector.targetReference,
      component,
    }
  }

  appendAt(at: FlowNode): void {
    throw new Error('Method not implemented.')
  }

  appendFreeAt(flowData: FlowMetaParamWithSize) {
    const nodeProps = {
      x: flowData.x,
      y: flowData.y,
      width: flowData.width || FlowRecordCreate.DefaultNodeProps.width,
      height: flowData.height || FlowRecordCreate.DefaultNodeProps.height,
      component: FlowRecordCreate.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(flowRecordCreate: FlowMetaUpdate): void {
    this.name = flowRecordCreate.name
    this.description = flowRecordCreate.description
    this.toJson()
  }

  updateConnector(
    targetId: string,
    options: 'connector' | 'faultConnector'
  ): void {
    this[options] = { targetReference: targetId }
    this.toJson()
  }

  deleteConnector(target, nodeTarget) {
    if (
      this.faultConnector.targetReference === target &&
      nodeTarget.label === 'Fault'
    ) {
      this.faultConnector = { targetReference: '' }
    } else {
      this.connector = { targetReference: '' }
    }
    this.toJson()
  }

  toJson(): FlowMetaParam {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      connector: this.connector,
      faultConnector: this.faultConnector,
    }
  }
}
