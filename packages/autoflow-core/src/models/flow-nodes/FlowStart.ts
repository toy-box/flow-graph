import { define, observable } from '@formily/reactive'
import { IFlowNodeProps } from '@toy-box/flow-graph'
import { uid } from '@toy-box/toybox-shared'
import {
  IStartFlowMeta,
  TargetReference,
  Criteria,
  FlowType,
  ISchedule,
  FlowMetaType,
} from '../../types'
import { MetaFlow } from '../MetaFlow'
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

  constructor(flowStart: IStartFlowMeta, metaFlow: MetaFlow) {
    super(metaFlow, flowStart.id, flowStart.name)
    this.id = flowStart.id
    this.name = flowStart.name
    this.connector = flowStart.connector
    this.criteria = flowStart.criteria
    this.flowType = flowStart.flowType
    this.objectId = flowStart.objectId
    this.recordTriggerType = flowStart.recordTriggerType
    this.schedule = flowStart.schedule
    this.triggerType = flowStart.triggerType
    this.makeObservable()
  }

  protected makeObservable() {
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
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'begin',
      width,
      height,
      x,
      y,
      targets: [this.connector.targetReference],
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

  mountAt(): void {
    this.appendAt()
  }
}
