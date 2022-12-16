import { define, observable, action } from '@formily/reactive'
import { FlowNode, FlowNodeType, TargetProps } from '@toy-box/flow-graph'
import { IFlowNodeProps } from '@toy-box/flow-graph/src'
import { uid } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowMetaParamWithSize,
  FlowMetaType,
  FlowMetaUpdate,
  IwaitEvent,
  TargetReference,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export class FlowWait extends FlowMetaNode {
  id: string
  name: string
  description?: string
  connector?: TargetReference
  defaultConnector?: TargetReference
  defaultConnectorName?: string
  waitEvents?: IwaitEvent[]

  static DefaultNodeProps = {
    width: 60,
    height: 60,
    component: 'WaitNode',
  }

  get type() {
    return FlowMetaType.WAIT
  }

  get defaultRuleId() {
    return uid()
  }

  get commRules() {
    return [
      ...this.waitEvents.map((rule) => ({
        id: rule.id,
        connector: rule.connector,
      })),
      { id: this.defaultRuleId, connector: this.defaultConnector },
    ]
  }

  get lowerLeverConnector() {
    return this.defaultConnector
  }

  constructor(flowWait: FlowMetaParam, metaFlow: MetaFlow | FreeFlow) {
    super(metaFlow, flowWait.id, flowWait.name, flowWait.description)
    this.connector = flowWait.connector
    this.defaultConnector = flowWait.defaultConnector ?? {
      targetReference: '',
    }
    this.defaultConnectorName = flowWait.defaultConnectorName
    this.waitEvents = flowWait.waitEvents
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      description: observable.ref,
      defaultConnector: observable.shallow,
      defaultConnectorName: observable.ref,
      waitEvents: observable.deep,
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
    }: IMakeFlowNodeProps = FlowWait.DefaultNodeProps
  ): IFlowNodeProps {
    const targets = []
    this.waitEvents.forEach((rule) => {
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
    }: IMakeFlowNodeProps = FlowWait.DefaultNodeProps,
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
          ...this.waitEvents.map((rule) => ({
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
      ...this.waitEvents.map((rule) => ({
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
        FlowWait.DefaultNodeProps,
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
      width: flowData.width || FlowWait.DefaultNodeProps.width,
      height: flowData.height || FlowWait.DefaultNodeProps.height,
      component: FlowWait.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(payload: FlowMetaUpdate) {
    this.name = payload.name
    this.description = payload.description
    this.defaultConnectorName = payload.defaultConnectorName
    this.waitEvents = payload.waitEvents
  }

  updateConnector(
    targetId: string,
    options: number | 'defaultConnector'
  ): void {
    // this[options] = { targetReference: targetId }
    if (options === 'defaultConnector') {
      this.defaultConnector = { targetReference: targetId }
    } else {
      this.waitEvents[options] = {
        ...this.waitEvents[options],
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
      this.waitEvents.map((rule, index) => {
        if (rule.connector.targetReference === target && rule.id === ruleId) {
          this.waitEvents[index] = {
            ...this.waitEvents[index],
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
      waitEvents: this.waitEvents,
    }
  }
}
