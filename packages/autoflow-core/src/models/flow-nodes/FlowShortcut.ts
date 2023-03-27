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
  ICallArgumentData,
  FlowMetaType,
  FlowMetaParamWithSize,
  VariableParam,
} from '../../types'
import { FreeFlow } from '../FreeFlow'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'
import { IFieldMeta } from '@toy-box/meta-schema'

export interface ShortcuParam {
  id: string
  name: string
  type: FlowMetaType
  description?: string
  connector?: TargetReference
  faultConnector?: TargetReference
  variable: IFieldMeta[]
  shortcutJson: any
  shortcutId: string
  x: number
  y: number
}

export class FlowShortcut extends FlowMetaNode {
  connector?: TargetReference
  faultConnector?: TargetReference
  variable: IFieldMeta[]
  shortcutJson: any
  shortcutId: string

  static DefaultConnectorProps = {
    targetReference: '',
  }

  static DefaultNodeProps: IMakeFlowNodeProps = {
    width: 60,
    height: 60,
    component: 'ShortcutNode',
  }

  get type() {
    return FlowMetaType.SHORTCUT
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

  constructor(flowShortcut: ShortcuParam, metaFlow: MetaFlow | FreeFlow) {
    super(
      metaFlow,
      flowShortcut.id,
      flowShortcut.name,
      flowShortcut.description
    )
    this.connector = flowShortcut.connector ?? {
      targetReference: '',
    }
    this.faultConnector = flowShortcut.faultConnector ?? { targetReference: '' }
    this.variable = flowShortcut.variable
    this.shortcutJson = flowShortcut.shortcutJson
    this.shortcutId = flowShortcut.shortcutId
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      connector: observable.deep,
      faultConnector: observable.deep,
      variable: observable.deep,
      shortcutJson: observable.deep,
      shortcutId: observable.ref,
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
    }: IMakeFlowNodeProps = FlowShortcut.DefaultNodeProps
  ): IFlowNodeProps {
    const targets = []
    const conId = this.connector.targetReference
    if (conId) targets.push({ id: conId })
    const faultConId = this.faultConnector.targetReference
    if (faultConId)
      targets.push({
        id: faultConId,
        label: this.faultConnectorName,
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
    }: IMakeFlowNodeProps = FlowShortcut.DefaultNodeProps,
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
        FlowShortcut.DefaultNodeProps,
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
      width: flowData.width || FlowShortcut.DefaultNodeProps.width,
      height: flowData.height || FlowShortcut.DefaultNodeProps.height,
      component: FlowShortcut.DefaultNodeProps.component,
    }
    const flowNode = this.makeFlowNode(nodeProps)
    this.metaFlow.flow.addFlowFreeNode(flowNode)
  }

  update(payload: ShortcuParam): void {
    this.name = payload.name
    this.description = payload.description
    this.variable = payload.variable
    this.shortcutJson = payload.shortcutJson
    this.shortcutId = payload.shortcutId
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
      nodeTarget.label === this.faultConnectorName
    ) {
      this.faultConnector = { targetReference: '' }
    } else {
      this.connector = { targetReference: '' }
    }
    this.toJson()
  }

  toJson(): ShortcuParam {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      connector: this.connector,
      faultConnector: this.faultConnector,
      variable: this.variable,
      shortcutJson: this.shortcutJson,
      shortcutId: this.shortcutId,
      x: this.x,
      y: this.y,
    }
  }
}
