import { Flow } from './Flow'
import { ReactFlowCanvas } from '../canvas'
import { action, batch, define, observable } from '@formily/reactive'

export class FlowFree extends Flow {
  makeObservable() {
    define(this, {
      id: observable.ref,
      flowGraph: observable.ref,
      canvas: observable.ref,
      flowType: observable.ref,
      setCanvas: action,
      addFlowNodeAt: batch,
      addFlowNode: action,
      addFlowNodes: action,
      addGraphNode: action,
      updateNode: action,
      removeNode: action,
      removeNodes: action,
      addGraphEdge: action,
      addGraphEdges: batch,
      setFlowNodes: batch,
      layoutFlow: batch,
    })
  }

  setCanvas(canvas: ReactFlowCanvas) {
    this.canvas = canvas
  }
}
