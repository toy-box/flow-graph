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
  IOutputAssignment,
  FlowMetaType,
  FlowMetaParamWithSize,
  Criteria,
  SortOrder,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowRecordLookup extends FlowMetaNode {
  connector?: TargetReference
  faultConnector?: TargetReference
  criteria?: Criteria | null
  registerId?: string
  outputAssignments?: IOutputAssignment[]
  outputReference?: null | string
  queriedFields?: string[]
  sortOrder?: SortOrder
  sortField?: string
  getFirstRecordOnly?: boolean
  storeOutputAutomatically?: boolean

  static DefaultConnectorProps = {
    targetReference: '',
  }

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'RecordLookupNode',
  }

  get type() {
    return FlowMetaType.RECORD_LOOKUP
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

  constructor(flowRecordLookup: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      flowRecordLookup.id,
      flowRecordLookup.name,
      flowRecordLookup.description
    )
    this.connector =
      flowRecordLookup.connector ?? FlowRecordLookup.DefaultConnectorProps
    this.faultConnector =
      flowRecordLookup.faultConnector ?? FlowRecordLookup.DefaultConnectorProps
    this.registerId = flowRecordLookup.registerId
    this.outputAssignments = flowRecordLookup.outputAssignments
    this.outputReference = flowRecordLookup.outputReference
    this.queriedFields = flowRecordLookup.queriedFields
    this.sortOrder = flowRecordLookup.sortOrder
    this.sortField = flowRecordLookup.sortField
    this.getFirstRecordOnly = flowRecordLookup.getFirstRecordOnly
    this.storeOutputAutomatically = flowRecordLookup.storeOutputAutomatically
    this.criteria = flowRecordLookup.criteria
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      registerId: observable.ref,
      criteria: observable.deep,
      outputAssignments: observable.deep,
      outputReference: observable.ref,
      queriedFields: observable.deep,
      sortOrder: observable.deep,
      sortField: observable.ref,
      getFirstRecordOnly: observable.ref,
      storeOutputAutomatically: observable.ref,
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
    }: IMakeFlowNodeProps = FlowRecordLookup.DefaultNodeProps
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
    }: IMakeFlowNodeProps = FlowRecordLookup.DefaultNodeProps,
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
        FlowRecordLookup.DefaultNodeProps,
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
      width: flowData.width || FlowRecordLookup.DefaultNodeProps.width,
      height: flowData.height || FlowRecordLookup.DefaultNodeProps.height,
      component: FlowRecordLookup.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(flowRecordLookup: FlowMetaUpdate): void {
    this.name = flowRecordLookup.name
    this.description = flowRecordLookup.description
    this.registerId = flowRecordLookup.registerId
    this.outputAssignments = flowRecordLookup.outputAssignments
    this.outputReference = flowRecordLookup.outputReference
    this.queriedFields = flowRecordLookup.queriedFields
    this.sortOrder = flowRecordLookup.sortOrder
    this.sortField = flowRecordLookup.sortField
    this.getFirstRecordOnly = flowRecordLookup.getFirstRecordOnly
    this.storeOutputAutomatically = flowRecordLookup.storeOutputAutomatically
    this.criteria = flowRecordLookup.criteria
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
      outputAssignments: this.outputAssignments,
      criteria: this.criteria,
      outputReference: this.outputReference,
      queriedFields: this.queriedFields,
      sortOrder: this.sortOrder,
      sortField: this.sortField,
      getFirstRecordOnly: this.getFirstRecordOnly,
      storeOutputAutomatically: this.storeOutputAutomatically,
    }
  }
}
