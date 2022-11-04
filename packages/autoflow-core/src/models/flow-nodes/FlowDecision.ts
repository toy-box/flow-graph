import { define, observable, action } from '@formily/reactive'
import { FlowNode, FlowNodeType, TargetProps } from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaType,
  FlowMetaUpdate,
  IFlowMetaDecisionRule,
  TargetReference,
} from '../../types'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowDecision extends FlowMetaNode {
  id: string
  name: string
  description?: string
  connector?: TargetReference
  defaultConnector?: TargetReference
  defaultConnectorName?: string
  rules?: IFlowMetaDecisionRule[]

  static DefaultNodeProps = {
    width: 60,
    height: 60,
    component: 'DecisionNode',
  }

  get type() {
    return FlowMetaType.DECISION
  }

  get defaultRuleId() {
    return uid()
  }

  get commRules() {
    return [
      ...this.rules.map((rule) => ({ id: rule.id, connector: rule.connector })),
      { id: this.defaultRuleId, connector: this.defaultConnector },
    ]
  }

  get lowerLeverConnector() {
    return this.defaultConnector
  }

  constructor(flowDecision: FlowMetaParam, metaFlow: MetaFlow) {
    super(
      metaFlow,
      flowDecision.id,
      flowDecision.name,
      flowDecision.description
    )
    this.connector = flowDecision.connector
    this.defaultConnector = flowDecision.defaultConnector ?? {}
    this.defaultConnectorName = flowDecision.defaultConnectorName
    this.rules = flowDecision.rules
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      description: observable.ref,
      defaultConnector: observable.shallow,
      defaultConnectorName: observable.ref,
      rules: observable.deep,
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
    }: IMakeFlowNodeProps = FlowDecision.DefaultNodeProps
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
      targets: [
        ...this.rules.map((rule) => ({
          id: rule.connector.targetReference,
          label: rule.name,
        })),
        { id: this.defaultConnector.targetReference },
      ],
      component,
    }
  }

  get nextNodes() {
    return this.metaFlow.flowMetaNodes.filter((node) =>
      this.commRules.some((rule) => rule.connector.targetReference === node.id)
    )
  }

  makeFlowNodeWithExtend(
    {
      width,
      height,
      x,
      y,
      component,
    }: IMakeFlowNodeProps = FlowDecision.DefaultNodeProps,
    targets: TargetProps[]
  ): IFlowNodeProps[] {
    const defaultRuleId = uid()
    const decisionEndId = uid()
    return [
      {
        id: this.id,
        label: this.name,
        data: this,
        type: 'decisionBegin',
        decisionEndTarget: decisionEndId,
        width,
        height,
        x,
        y,
        targets: [
          ...this.rules.map((rule) => ({
            id: rule.id,
            label: rule.name,
          })),
          {
            id: defaultRuleId,
            label: 'default',
          },
        ],
        component,
      },
      ...this.rules.map((rule) => ({
        id: rule.id,
        type: 'extend' as FlowNodeType,
        targets: [rule.connector.targetReference ?? decisionEndId],
        ...FlowMetaNode.ExtendNodeProps,
      })),
      {
        id: defaultRuleId,
        type: 'extend',
        targets: [this.defaultConnector.targetReference ?? decisionEndId],
        ...FlowMetaNode.ExtendNodeProps,
      },
      {
        id: decisionEndId,
        type: 'decisionEnd',
        targets,
        ...FlowMetaNode.ExtendNodeProps,
      },
    ]
  }

  appendAt(at: FlowNode) {
    if (this.flowNode == null) {
      const flowNodes = this.makeFlowNodeWithExtend(
        FlowDecision.DefaultNodeProps,
        at.targets
      )
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
      flowNodes.forEach((node, idx) => {
        if (idx > 0) {
          this.metaFlow.flow.addFlowNode(node)
        }
      })
    }
  }

  update(payload: FlowMetaUpdate) {
    this.name = payload.name
    this.description = payload.description
    this.defaultConnectorName = payload.defaultConnectorName
    this.rules = payload.rules
  }

  jsonization = (): FlowMetaParam => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      connector: this.connector,
      rules: this.rules,
    }
  }
}
