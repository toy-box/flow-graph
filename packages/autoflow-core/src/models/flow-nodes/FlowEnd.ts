import { define, observable, action } from '@formily/reactive'
import { FlowNode, IFlowNodeProps } from '@toy-box/flow-graph/src'
import { FlowMetaType } from '../../types'
import { MetaFlow } from '../MetaFlow'
import { FlowMetaNode, IMakeFlowNodeProps } from './FlowMetaNode'

export interface IFlowEndProps {
  id: string
  name: string
}

export class FlowEnd extends FlowMetaNode {
  static DefaultNodeProps = {
    width: 60,
    height: 60,
    component: 'EndNode',
  }

  get type() {
    return FlowMetaType.END
  }

  constructor(flowEnd: IFlowEndProps, metaFlow: MetaFlow) {
    super(metaFlow, flowEnd.id, flowEnd.name)
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      id: observable.ref,
      name: observable.ref,
      onEdit: action,
    })
  }

  makeFlowNode(
    {
      width,
      height,
      x,
      y,
      component,
    }: IMakeFlowNodeProps = FlowEnd.DefaultNodeProps
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
    }: IMakeFlowNodeProps = FlowEnd.DefaultNodeProps
  ): IFlowNodeProps[] {
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
        component,
      },
    ]
  }

  appendAt(at: FlowNode): void {
    if (this.flowNode == null) {
      const flowNodes = this.makeFlowNodeWithExtend(FlowEnd.DefaultNodeProps)
      this.metaFlow.flow.addFlowNodeAt(at.id, flowNodes[0])
    }
  }

  onEdit = (flowEnd: IFlowEndProps) => {
    this.id = flowEnd.id
    this.name = flowEnd.name
  }
}
