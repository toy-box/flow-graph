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

export class FlowRecordUpdate extends FlowMetaNode {
  connector?: TargetReference
  faultConnector?: TargetReference
  criteria?: Criteria | null
  registerId?: string
  inputAssignments?: IInputAssignment[]

  static DefaultConnectorProps = {
    targetReference: '',
  }

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'RecordUpdateNode',
  }

  get type() {
    return FlowMetaType.RECORD_UPDATE
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

  constructor(flowRecordUpdate: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      flowRecordUpdate.id,
      flowRecordUpdate.name,
      flowRecordUpdate.description
    )
    this.connector =
      flowRecordUpdate.connector ?? FlowRecordUpdate.DefaultConnectorProps
    this.faultConnector =
      flowRecordUpdate.faultConnector ?? FlowRecordUpdate.DefaultConnectorProps
    this.registerId = flowRecordUpdate.registerId
    this.inputAssignments = flowRecordUpdate.inputAssignments
    this.criteria = flowRecordUpdate.criteria
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      registerId: observable.ref,
      criteria: observable.deep,
      inputAssignments: observable.deep,
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
    }: IMakeFlowNodeProps = FlowRecordUpdate.DefaultNodeProps
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
    }: IMakeFlowNodeProps = FlowRecordUpdate.DefaultNodeProps,
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
        FlowRecordUpdate.DefaultNodeProps,
        at.targets
      )
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
      this.metaFlow.flow.addFlowNode(flowNodes[1])
    }
    this.toJson()
  }

  appendFreeAt(flowData: FlowMetaParamWithSize) {
    const nodeProps = {
      x: flowData.x,
      y: flowData.y,
      width: flowData.width || FlowRecordUpdate.DefaultNodeProps.width,
      height: flowData.height || FlowRecordUpdate.DefaultNodeProps.height,
      component: FlowRecordUpdate.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(flowRecordupdate: FlowMetaUpdate): void {
    this.name = flowRecordupdate.name
    this.description = flowRecordupdate.description
    this.registerId = flowRecordupdate.registerId
    this.inputAssignments = flowRecordupdate.inputAssignments
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
      inputAssignments: this.inputAssignments,
      criteria: this.criteria,
    }
  }
}
