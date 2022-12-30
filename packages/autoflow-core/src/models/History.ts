import { define, observable, action } from '@formily/reactive'
import { IConnectionWithLabel, IEdge } from '@toy-box/flow-graph'
import { FlowMetaParam, FlowMetaType } from '../types'
import { FlowMetaNode } from './flow-nodes'
// import { NodeProps } from './AutoFlow'

export enum OpearteTypeEnum {
  ADD_NODE = 'addNode',
  REMOVE_NODE = 'removeNode',
  UPDATE_NODE = 'updateNode',
  ADD_EDGE = 'addEdge',
  REMOVE_Edge = 'removeEdge',
}

export interface HistoryItem {
  type: OpearteTypeEnum
  flowMetaNodeMap: Record<string, FlowMetaNode>
  flowNode?: FlowMetaNode
  nodeChange?: {
    id: string
    type: string
  }
  edge?: IEdge
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
  current = 0
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
    this.current = this.history.length
    this.context = {
      ...context,
      timestamp: new Date().getTime(),
    }
    this.history.push(this.context)
    // const overSizeCount = this.history.length - this.maxSize
    // if (overSizeCount > 0) {
    //   this.history.splice(0, overSizeCount)
    //   this.current = this.history.length - 1
    // }
  }

  get allowUndo() {
    return this.history.length > 0 && this.current - 1 >= 0
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
      const item = this.history[this.current - 1]
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
