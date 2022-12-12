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
      flowRecordCreate.defaultConnector ??
      FlowRecordCreate.DefaultConnectorProps
    this.faultConnector =
      flowRecordCreate.nextValueConnector ??
      FlowRecordCreate.DefaultConnectorProps
    this.makeObservable()
  }

  // constructor(flowRecordCreate: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
  //   super(metaFlow, flowRecordCreate.id, flowRecordCreate.name, flowRecordCreate.description)
  //   // this.defaultConnector = flowLoop.defaultConnector ?? {
  //   //   targetReference: '',
  //   // }
  //   // this.nextValueConnector = flowLoop.nextValueConnector ?? {
  //   //   targetReference: '',
  //   // }
  //   // this.collectionReference = flowLoop.collectionReference
  //   // this.iterationOrder = flowLoop.iterationOrder
  //   // this.description = flowLoop.description
  //   // this.makeObservable()
  // }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      connector: observable.deep,
      faultConnector: observable.deep,
      update: action,
    })
  }

  makeFlowNode(props?: IMakeFlowNodeProps): IFlowNodeProps {
    throw new Error('Method not implemented.')
  }
  appendAt(at: FlowNode): void {
    throw new Error('Method not implemented.')
  }
  appendFreeAt(flowData: FlowMetaParam): void {
    throw new Error('Method not implemented.')
  }
  update(flowRecordCreate: FlowMetaUpdate): void {
    this.name = flowRecordCreate.name
    this.description = flowRecordCreate.description
    this.toJson()
  }
  deleteConnector(targetId: string, label?: string): void {
    throw new Error('Method not implemented.')
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
