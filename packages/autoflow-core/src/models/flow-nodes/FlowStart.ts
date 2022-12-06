import { action, batch, define, observable } from '@formily/reactive'
import { IFlowNodeProps } from '@toy-box/flow-graph'
import { uid } from '@toy-box/toybox-shared'
import {
  IStartFlowMeta,
  TargetReference,
  Criteria,
  FlowType,
  ISchedule,
  FlowMetaType,
  FlowMetaParam,
  FlowMetaParamWithSize,
} from '../../types'
import { MetaFlow } from '../MetaFlow'
import { FreeFlow } from '../FreeFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowStart extends FlowMetaNode {
  flowType: FlowType
  connector?: TargetReference
  criteria?: Criteria | null
  objectId?: string
  recordTriggerType?: string
  schedule?: ISchedule
  triggerType?: string

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'StartNode',
  }

  get type() {
    return FlowMetaType.START
  }

  get nextNodes() {
    return this.metaFlow.flowMetaNodes.filter(
      (node) => node.id === this.connector.targetReference
    )
  }

  get lowerLeverConnector() {
    return this.connector
  }

  constructor(flowStart: IStartFlowMeta, metaFlow: MetaFlow | FreeFlow) {
    super(metaFlow, flowStart.id, flowStart.name)
    this.connector = flowStart.connector
    this.criteria = flowStart.criteria
    this.flowType = flowStart.flowType
    this.objectId = flowStart.objectId
    this.recordTriggerType = flowStart.recordTriggerType
    this.schedule = flowStart.schedule
    this.triggerType = flowStart.triggerType
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      type: observable.ref,
      connector: observable.deep,
      criteria: observable.deep,
      objectId: observable.ref,
      recordTriggerType: observable.ref,
      schedule: observable.deep,
      triggerType: observable.ref,
      update: action,
      appendAt: batch,
    })
  }

  makeFlowNode(
    {
      width,
      height,
      x,
      y,
      component,
    }: IMakeFlowNodeProps = FlowStart.DefaultNodeProps
  ): IFlowNodeProps {
    const conId = this?.connector?.targetReference
    const targets = []
    if (conId) targets.push(conId)
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'begin',
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
    }: IMakeFlowNodeProps = FlowStart.DefaultNodeProps
  ): IFlowNodeProps[] {
    const extendId = uid()
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
        component,
      },
      {
        id: extendId,
        type: 'extend',
        targets: [this.connector.targetReference],
        ...FlowMetaNode.ExtendNodeProps,
      },
    ]
  }

  appendAt(): void {
    if (this.flowNode == null) {
      const flowNodes = this.makeFlowNodeWithExtend(FlowStart.DefaultNodeProps)
      this.metaFlow.flow.addFlowNodes(flowNodes)
    }
  }

  appendFreeAt(flowData: FlowMetaParamWithSize) {
    const nodeProps = {
      x: flowData.x,
      y: flowData.y,
      width: flowData.width || FlowStart.DefaultNodeProps.width,
      height: flowData.height || FlowStart.DefaultNodeProps.height,
      component: FlowStart.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.freeFlow.flow.addFlowFreeNode(flowNode)
  }

  append(): void {
    if (this.flowNode == null) {
      const flowNode = this.makeFlowNode(FlowStart.DefaultNodeProps)
      this.metaFlow.flow.addFlowNodes([flowNode])
    }
  }

  update(data: Omit<IStartFlowMeta, 'id'>) {
    this.name = data.name
    this.description = data.description
    this.connector = data.connector
    this.criteria = data.criteria
    this.flowType = data.flowType
    this.objectId = data.objectId
    this.recordTriggerType = data.recordTriggerType
    this.schedule = data.schedule
    this.triggerType = data.triggerType
  }

  updateConnector = (targetId: string) => {
    this.connector = { targetReference: targetId }
    this.toJson()
  }

  deleteConnector() {
    this.connector = { targetReference: '' }
    this.toJson()
  }

  toJson = (): FlowMetaParam => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      connector: this.connector,
      criteria: this.criteria,
    }
  }
}
