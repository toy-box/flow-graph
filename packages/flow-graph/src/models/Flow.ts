import { Edge, Graph } from '@antv/x6';
import '@antv/x6-react-shape';
import { FlowGraph } from './FlowGraph';
import { ICanvas } from './Canvas';
import { AntvCanavs } from './AntvCanvas';
import { FlowNode, IFlowNodeProps } from './FlowNode';
import { uid } from '../shared';

const makeForkVertices = (source: FlowNode, target: FlowNode) => {
  return [{ x: target.centerX, y: source.centerY }];
};

const makeJoinVertices = (source: FlowNode, target: FlowNode) => {
  return [{ x: source.centerX, y: target.centerY }];
};

const makeLeftSideVertices = (source: FlowNode, target: FlowNode) => {
  const width =
    target.areaWidth > source.areaWidth ? target.areaWidth : source.areaWidth;
  return [
    { x: source.centerX - width / 2, y: source.centerY },
    { x: source.centerX - width / 2, y: target.centerY },
  ];
};

const makeRightSideVertices = (source: FlowNode, target: FlowNode) => {
  const width =
    target.areaWidth > source.areaWidth ? target.areaWidth : source.areaWidth;
  return [
    { x: source.centerX + width / 2, y: source.centerY },
    { x: source.centerX + width / 2, y: target.centerY },
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
              vertices: makeLeftSideVertices(
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
              vertices: makeRightSideVertices(
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
    if (this.canvas) {
      if (node.type === 'begin') {
        this.canvas.addNode({
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          sharp: 'StartNode',
        });
      } else {
        this.canvas.addNode({
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          sharp: 'StartNode',
        });
      }
    }
  };

  addGraphEdge = (edge: Edge.Metadata) => {
    if (this.canvas) {
      this.canvas.addEdge(edge);
    }
  };

  addGraphEdges = (edges: Edge.Metadata[]) => {
    if (this.canvas) {
      this.canvas.addEdges(edges);
    }
  };
}
