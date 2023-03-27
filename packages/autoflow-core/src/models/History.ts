import { define, observable, action } from '@formily/reactive'
import { IConnectionWithLabel, IEdge, TargetProps } from '@toy-box/flow-graph'
import { FlowMetaParam, FlowMetaType } from '../types'
import { FlowMetaNode } from './flow-nodes'
// import { NodeProps } from './AutoFlow'

export enum OpearteTypeEnum {
  ADD_NODE = 'addNode',
  REMOVE_NODE = 'removeNode',
  UPDATE_NODE = 'updateNode',
  ADD_EDGE = 'addEdge',
  REMOVE_EDGE = 'removeEdge',
}

export interface HistoryItem {
  type: OpearteTypeEnum
  flowMetaNodeMap: Record<string, FlowMetaNode>
  updateMetaNodeMap: Record<string, FlowMetaNode>
  flowNode?: FlowMetaNode
  edges?: IEdge[]
  nodeId?: string
  // flow: FlowMeta
  timestamp?: number
}

export interface IHistoryProps {
  onRedo(item: HistoryItem): void
  onUndo(item: HistoryItem): void
}
export class History {
  context?: HistoryItem
  props?: IHistoryProps
  current = -1
  history: HistoryItem[] = []
  updateTimer = null
  maxSize = 100
  constructor(context?: HistoryItem, props?: IHistoryProps) {
    this.props = props
    if (context) {
      this.push(context)
    }
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      current: observable.ref,
      history: observable.shallow,
      push: action,
      undo: action,
      redo: action,
      goTo: action,
      clear: action,
    })
  }

  list() {
    return this.history
  }

  push(context: HistoryItem) {
    // if (this.current < this.history.length - 1) {
    //   this.history = this.history.slice(0, this.current + 1)
    // }
    // const currentIdx = this.current
    this.current = this.history.length
    // this.current += 1
    const timestamp = new Date().getTime()
    // const isRemoveNode = this.context?.edges.some((edge) => {
    //   const sourceData = context.updateMetaNodeMap[edge.source]
    //   const targetData = context.updateMetaNodeMap[edge.target]
    //   const target = context?.flowNode?.flowNode.targets.find(
    //     (target) => target.id === edge.target
    //   )
    //   if ((!sourceData || !targetData) && target) return true
    // })
    const idx = this.current - 1
    if (
      context?.type === OpearteTypeEnum.REMOVE_NODE &&
      this.history?.[idx]?.nodeId
    ) {
      this.current--
      this.history[idx].type = context.type
      this.history[idx].flowNode = context.flowNode
      this.history[idx].flowMetaNodeMap = context.flowMetaNodeMap
      this.history[idx].updateMetaNodeMap = context.updateMetaNodeMap
      this.history[idx].nodeId = undefined
    } else {
      // this.history.splice(this.current + 1, 0, this.context)
      this.context = {
        ...context,
        timestamp,
      }
      this.history.push(this.context)
      // this.history.splice(this.current, 0, this.context)
    }
    console.log(this.history, 'this.history')
    // const overSizeCount = this.history.length - this.maxSize
    // if (overSizeCount > 0) {
    //   this.history.splice(0, overSizeCount)
    //   this.current = this.history.length - 1
    // }
  }

  get allowUndo() {
    return this.history.length > 0 && this.current >= 0
  }

  get allowRedo() {
    return this.history.length > this.current + 1
  }

  redo() {
    if (this.allowRedo) {
      const item = this.history[this.current + 1]
      this.context = item
      this.current++
      if (this.props?.onRedo) {
        this.props.onRedo(item)
      }
    }
  }

  undo() {
    if (this.allowUndo) {
      const item = this.history[this.current]
      this.context = item
      this.current--
      if (this.props?.onUndo) {
        this.props.onUndo(item)
      }
    }
  }

  goTo(index: number) {
    if (this.history[index]) {
      this.context = this.history[index]
      this.current = index
    }
  }

  clear() {
    this.history = []
    this.context = undefined
    this.current = 0
  }
}
