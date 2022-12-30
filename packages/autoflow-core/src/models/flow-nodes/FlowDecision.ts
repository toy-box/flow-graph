import { define, observable, action } from '@formily/reactive'
import {
  FlowNode,
  FlowNodeType,
  LayoutModeEnum,
  TargetProps,
} from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaParamWithSize,
  FlowMetaType,
  FlowMetaUpdate,
  IFlowMetaDecisionRule,
  TargetReference,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
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

  constructor(flowDecision: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      flowDecision.id,
      flowDecision.name,
      flowDecision.description
    )
    this.connector = flowDecision.connector
    this.defaultConnector = flowDecision.defaultConnector ?? {
      targetReference: '',
    }
    this.defaultConnectorName = flowDecision.defaultConnectorName ?? 'default'
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
    const targets = []
    this.rules.forEach((rule) => {
      const conId = rule?.connector?.targetReference
      if (conId)
        targets.push({
          id: conId,
          label: rule.name,
          ruleId: rule.id,
        })
    })
    const defaultConId = this.defaultConnector.targetReference
    if (defaultConId)
      targets.push({
        id: defaultConId,
        label: this.defaultConnectorName,
        ruleId: null,
      })
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
            label: this.defaultConnectorName,
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

  appendFreeAt(flowData: FlowMetaParamWithSize) {
    const nodeProps = {
      x: flowData.x,
      y: flowData.y,
      width: flowData.width || FlowDecision.DefaultNodeProps.width,
      height: flowData.height || FlowDecision.DefaultNodeProps.height,
      component: FlowDecision.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(payload: FlowMetaUpdate) {
    this.name = payload.name
    this.description = payload.description
    this.defaultConnectorName = payload.defaultConnectorName
    const rules = payload.rules.map((rule) => {
      if (!rule.connector)
        return {
          ...rule,
          connector: {
            targetReference: '',
          },
        }
      return rule
    })
    this.rules = rules
    if (this.metaFlow.layoutMode === LayoutModeEnum.FREE_LAYOUT) {
      const flowNode = this.makeFlowNode()
      this.metaFlow.flow.updateFreeNode(flowNode)
    }
  }

  updateConnector(
    targetId: string,
    options: number | 'defaultConnector'
  ): void {
    // this[options] = { targetReference: targetId }
    if (options === 'defaultConnector') {
      this.defaultConnector = { targetReference: targetId }
    } else {
      this.rules[options] = {
        ...this.rules[options],
        connector: { targetReference: targetId },
      }
    }
    this.toJson()
  }

  deleteConnector(target, nodeTarget) {
    const { ruleId } = nodeTarget
    if (
      this.defaultConnector.targetReference === target &&
      (ruleId === null || ruleId.split('-')[0] === 'default')
    ) {
      this.defaultConnector = { targetReference: '' }
    } else {
      this.rules.map((rule, index) => {
        if (rule?.connector?.targetReference === target && rule.id === ruleId) {
          this.rules[index] = {
            ...this.rules[index],
            connector: { targetReference: '' },
          }
        }
      })
    }
    this.toJson()
  }

  toJson = (): FlowMetaParam => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      defaultConnector: this.defaultConnector,
      defaultConnectorName: this.defaultConnectorName,
      rules: this.rules,
    }
  }
}
