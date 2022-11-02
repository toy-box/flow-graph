import { define, observable, action } from '@formily/reactive'
import { FlowNode, TargetProps } from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaUpdate,
  TargetReference,
  IAssignmentData,
  FlowMetaType,
} from '../../types'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowAssignment extends FlowMetaNode {
  connector?: TargetReference
  assignmentItems?: IAssignmentData[]

  static DefaultNodeProps = {
    width: 60,
    height: 60,
    component: 'AssignmentNode',
  }

  get type() {
    return FlowMetaType.ASSIGNMENT
  }

  get lowerLeverConnector() {
    return this.connector
  }

  constructor(flowAssignment: FlowMetaParam, metaFlow: MetaFlow) {
    super(
      metaFlow,
      flowAssignment.id,
      flowAssignment.name,
      flowAssignment.description
    )
    this.connector = flowAssignment.connector
    this.assignmentItems = flowAssignment.assignmentItems
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      description: observable.ref,
      connector: observable.deep,
      assignmentItems: observable.deep,
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
    }: IMakeFlowNodeProps = FlowAssignment.DefaultNodeProps
  ): IFlowNodeProps {
    return {
      id: this.id,
      label: this.name,
      data: this,
      type: 'forward',
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
    }: IMakeFlowNodeProps = FlowAssignment.DefaultNodeProps,
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
        FlowAssignment.DefaultNodeProps,
        at.targets
      )
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
      this.metaFlow.flow.addFlowNode(flowNodes[1])
    }
  }

  update = (payload: FlowMetaUpdate) => {
    console.log('update assign', payload)
    this.name = payload.name
    this.description = payload.description
    this.assignmentItems = payload.assignmentItems
  }
}
