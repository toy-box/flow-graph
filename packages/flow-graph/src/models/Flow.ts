import { Edge } from '@antv/x6';
import '@antv/x6-react-shape';
import { FlowGraph } from './FlowGraph';
import { ICanvas } from '../canvas';
import { FlowNode, IFlowNodeProps } from './FlowNode';
import { uid } from '../shared';
import { EdgeProps } from '../types';

const makeForkVertices = (source: FlowNode, target: FlowNode) => {
  return [{ x: target.centerX, y: source.centerY }];
};

const makeJoinVertices = (source: FlowNode, target: FlowNode) => {
  return [
    { x: source.centerX, y: target.centerY - target.height * 1.5 },
    { x: target.centerX, y: target.centerY - target.height * 1.5 },
  ];
};

const makeRightCycleVertices = (source: FlowNode, target: FlowNode) => {
  const width =
    target.areaWidth > source.areaWidth ? target.areaWidth : source.areaWidth;
  return [
    { x: source.centerX, y: source.centerY + source.height * 1.5 },
    { x: source.centerX + width / 2, y: source.centerY + source.height * 1.5 },
    { x: source.centerX + width / 2, y: target.centerY },
  ];
};

const makeLeftCycleVertices = (source: FlowNode, target: FlowNode) => {
  const width =
    target.areaWidth > source.areaWidth ? target.areaWidth : source.areaWidth;
  return [
    { x: source.centerX - width / 2, y: source.centerY },
    { x: source.centerX - width / 2, y: target.centerY - source.height },
    { x: source.centerX, y: target.centerY - source.height },
  ];
};

export class Flow {
  id: string;
  flowGraph: FlowGraph;
  canvas?: ICanvas;

  constructor() {
    this.id = uid();
    this.flowGraph = new FlowGraph({});
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
        if (sourceNode.type === 'cycleBegin' && sourceNode.areaEndNode) {
          this.addGraphEdges([
            {
              source: edge.v,
              target: edge.w,
            },
            {
              source: edge.v,
              target: sourceNode.areaEndNode.id,
              vertices: makeLeftCycleVertices(
                sourceNode,
                sourceNode.areaEndNode
              ),
            },
          ]);
        } else if (sourceNode.type === 'cycleBack') {
          if (sourceNode.cycleBegin) {
            this.addGraphEdge({
              source: edge.v,
              target: sourceNode.cycleBegin.id,
              vertices: makeRightCycleVertices(
                sourceNode,
                sourceNode.cycleBegin
              ),
            });
          }
        } else if (sourceNode.type === 'forkBegin') {
          this.addGraphEdge({
            source: edge.v,
            target: edge.w,
            vertices: makeForkVertices(sourceNode, targetNode),
          });
        } else if (targetNode.type === 'forkEnd') {
          this.addGraphEdge({
            source: edge.v,
            target: edge.w,
            vertices: makeJoinVertices(sourceNode, targetNode),
          });
        } else {
          this.addGraphEdge({
            source: edge.v,
            target: edge.w,
          });
        }
      });
    }
  }

  addGraphNode = (node: FlowNode) => {
    this.canvas &&
      this.canvas.addNode({
        id: node.id,
        type: node.type,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        component: node.component,
        contextMenu: node.contenxtMenu,
      });
  };

  addGraphEdge = (edge: EdgeProps) => {
    if (this.canvas) {
      this.canvas.addEdge(edge);
    }
  };

  addGraphEdges = (edges: EdgeProps[]) => {
    if (this.canvas) {
      this.canvas.addEdges(edges);
    }
  };
}
