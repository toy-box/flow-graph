import { action, batch, define, observable } from '@formily/reactive';
import { FlowGraph } from './FlowGraph';
import { ICanvas } from '../canvas';
import { FlowNode, IFlowNodeProps } from './FlowNode';
import { uid } from '../shared';
import { EdgeProps } from '../types';

const getAreaWidth = (start: FlowNode, end: FlowNode) => {
  return Math.max(start.areaWidth, end.areaWidth);
};

export class Flow {
  id: string;
  flowGraph: FlowGraph;
  canvas?: ICanvas;

  constructor() {
    this.id = uid();
    this.flowGraph = new FlowGraph({ standardSize: 20 });
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      id: observable.ref,
      flowGraph: observable.ref,
      canvas: observable.ref,
      setCanvas: action,
      setFlowNode: batch,
      addGraphNode: action,
      addGraphEdge: action,
      addGraphEdges: batch,
    });
  }

  setCanvas(canvas: ICanvas) {
    this.canvas = canvas;
  }

  setFlowNode(nodes: IFlowNodeProps[]) {
    this.flowGraph.setNodes(nodes);
    if (this.canvas) {
      const layout = this.flowGraph.layoutData();
      layout.nodes.forEach((node) => this.addGraphNode(node));
      layout.edges.forEach((edge) => {
        const sourceNode = this.flowGraph.getNode(edge.v);
        const targetNode = this.flowGraph.getNode(edge.w);
        if (sourceNode.isloopBack && targetNode.isloopEnd) {
          const loopBegin = sourceNode.loopBegin as FlowNode;
          // Loop cycle edge
          this.addGraphEdge({
            source: sourceNode.id,
            target: loopBegin.id,
            label: 'Loop cycle',
            sourceHandle: 'bottom',
            targetHandle: 'left',
            data: {
              targetXSet: -getAreaWidth(sourceNode, loopBegin) / 2,
            },
          });
          this.addGraphEdge({
            source: loopBegin.id,
            target: targetNode.id,
            label: 'Loop out',
            sourceHandle: 'right',
            targetHandle: 'top',
            data: {
              sourceXSet: getAreaWidth(loopBegin, targetNode) / 2,
            },
          });
        } else if (
          sourceNode.type === 'decisionBegin' ||
          targetNode.type === 'decisionEnd'
        ) {
          const target = sourceNode.targets?.find(
            (target) => target.id === targetNode.id
          );
          this.addGraphEdge({
            source: edge.v,
            target: edge.w,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'forkEdge',
            label: target?.label,
            data: {
              fork: sourceNode.type === 'decisionBegin',
            },
          });
        } else {
          this.addGraphEdge({
            source: edge.v,
            target: edge.w,
            sourceHandle: 'bottom',
            targetHandle: 'top',
          });
        }
      });
    }
  }

  addGraphNode = (node: FlowNode) => {
    this.canvas?.addNode({
      id: node.id,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      component: node.component,
      data: node.data,
    });
  };

  addGraphEdge = (edge: EdgeProps) => {
    this.canvas?.addEdge(edge);
  };

  addGraphEdges = (edges: EdgeProps[]) => {
    this.canvas?.addEdges(edges);
  };
}
