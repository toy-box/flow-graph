import { define, observable, action } from '@formily/reactive'
import {
  FlowNode,
  TargetProps,
  LayoutModeEnum,
  EdgeTypeEnum,
} from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaUpdate,
  TargetReference,
  IInputAssignment,
  FlowMetaType,
  FlowMetaParamWithSize,
  Criteria,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowRecordDelete extends FlowMetaNode {
  connector?: TargetReference
  faultConnector?: TargetReference
  criteria?: Criteria | null
  registerId?: string

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'RecordDeleteNode',
  }

  get type() {
    return FlowMetaType.RECORD_DELETE
  }

  get nextNodes() {
    return this.metaFlow.flowMetaNodes.filter(
      (node) => node.id === this.faultConnector.targetReference
    )
  }

  get lowerLeverConnector() {
    return this.connector
  }

  get faultConnectorName() {
    return 'Fault'
  }

  constructor(flowRecordDelete: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      flowRecordDelete.id,
      flowRecordDelete.name,
      flowRecordDelete.description
    )
    this.connector = flowRecordDelete.connector ?? {
      targetReference: '',
    }
    this.faultConnector = flowRecordDelete.faultConnector ?? {
      targetReference: '',
    }
    this.registerId = flowRecordDelete.registerId
    this.criteria = flowRecordDelete.criteria
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      registerId: observable.ref,
      criteria: observable.deep,
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
    }: IMakeFlowNodeProps = FlowRecordDelete.DefaultNodeProps
  ): IFlowNodeProps {
    const targets = []
    const conId = this.connector.targetReference
    if (conId) targets.push({ id: conId })
    const faultConId = this.faultConnector.targetReference
    if (faultConId)
      targets.push({
        id: faultConId,
        label: 'Fault',
        edgeType: EdgeTypeEnum.FAULT_EDGE,
      })
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'forward',
      width,
      height,
      x,
      y,
      targets:
        this.metaFlow.layoutMode === LayoutModeEnum.AUTO_LAYOUT
          ? [this.connector.targetReference]
          : targets,
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
    }: IMakeFlowNodeProps = FlowRecordDelete.DefaultNodeProps,
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

  appendAt(at: FlowNode): void {
    if (this.flowNode == null) {
      if (at.isLoopBack) {
        this.connector.targetReference = at.loopBegin.id
      } else {
        this.connector.targetReference = at.targets[0].id
      }
      const flowNodes = this.makeFlowNodeWithExtend(
        FlowRecordDelete.DefaultNodeProps,
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
      width: flowData.width || FlowRecordDelete.DefaultNodeProps.width,
      height: flowData.height || FlowRecordDelete.DefaultNodeProps.height,
      component: FlowRecordDelete.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(flowRecordupdate: FlowMetaUpdate): void {
    this.name = flowRecordupdate.name
    this.description = flowRecordupdate.description
    this.registerId = flowRecordupdate.registerId
    this.criteria = flowRecordupdate.criteria
    this.toJson()
  }

  updateConnector(targetId: string, isFaultConnector?: boolean): void {
    if (isFaultConnector) {
      this.faultConnector.targetReference = targetId
    } else {
      this.connector.targetReference = targetId
    }
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
      registerId: this.registerId,
      criteria: this.criteria,
      x: this.x,
      y: this.y,
    }
  }
}
