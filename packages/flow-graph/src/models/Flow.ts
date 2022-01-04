import { Edge } from '@antv/x6';
import '@antv/x6-react-shape';
import { FlowGraph } from './FlowGraph';
import { ICanvas } from '../canvas';
import { FlowNode, IFlowNodeProps } from './FlowNode';
import { uid } from '../shared';
import { EdgeProps } from '../types';

const makeForkVertices = (source: FlowNode, target: FlowNode) => {
  const targetLeng = source.targets?.length;
  let y = source.centerY;
  const centerIdx = targetLeng ? Math.floor(targetLeng / 2) : null;
  if (
    targetLeng &&
    targetLeng % 2 === 1 &&
    centerIdx &&
    source.targets &&
    source.targets[centerIdx] === target.id
  ) {
    y = source.centerY + target.height * 1.5;
  }
  return [{ x: target.centerX, y }];
};

const makeJoinVertices = (source: FlowNode, target: FlowNode) => {
  return [
    { x: source.centerX, y: target.centerY - target.height * 1.5 },
    { x: target.centerX, y: target.centerY - target.height * 1.5 },
  ];
};

const makeRightCycleVertices = (source: FlowNode, target: FlowNode) => {
  const width =
    (target.areaWidth > source.areaWidth
      ? target.areaWidth
      : source.areaWidth) + 30;
  return [
    { x: source.centerX, y: source.centerY + source.height * 1.5 },
    { x: source.centerX + width / 2, y: source.centerY + source.height * 1.5 },
    { x: source.centerX + width / 2, y: target.centerY },
  ];
};

const makeLeftCycleVertices = (
  source: FlowNode,
  target: FlowNode,
  targetNode: FlowNode
) => {
  let width =
    target.areaWidth > source.areaWidth ? target.areaWidth : source.areaWidth;
  if (
    (source.targets &&
      source.loopBackTarget === source.targets[0] &&
      target.type === 'loopEnd') ||
    !targetNode
  ) {
    width = source.areaWidth + 30;
  }
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
        const sourceNode: any = this.flowGraph.getNode(edge.v);
        const targetNode = this.flowGraph.getNode(edge.w);
        if (sourceNode.type === 'loopBegin' && sourceNode.loopEndTarget) {
          const loopEndTargetNode = this.flowGraph.getNode(
            sourceNode.loopEndTarget
          );
          const loopBackTargetNode: any = this.flowGraph.getNode(
            sourceNode.loopBackTarget
          );
          const targetNode = this.flowGraph.getNode(
            loopBackTargetNode.targets[0]
          );
          const target =
            targetNode.component === 'LabelNode'
              ? targetNode
              : loopEndTargetNode;
          this.addGraphEdges([
            {
              source: edge.v,
              target: edge.w,
            },
            {
              source: edge.v,
              // target: sourceNode.areaEndNode.id,
              target: target.id,
              vertices: makeLeftCycleVertices(
                sourceNode,
                target,
                sourceNode.loopBegin
              ),
            },
          ]);
        } else if (sourceNode.loopBegin) {
          if (sourceNode.loopBegin) {
            this.addGraphEdge({
              source: edge.v,
              target: sourceNode.loopBegin.id,
              vertices: makeRightCycleVertices(
                sourceNode,
                sourceNode.loopBegin
              ),
            });
          }
        } else if (sourceNode.type === 'decisionBegin') {
          this.addGraphEdge({
            source: edge.v,
            target: edge.w,
            vertices: makeForkVertices(sourceNode, targetNode),
          });
        } else if (sourceNode.decisionEnd) {
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
        label: node.label,
        width: node.width,
        height: node.height,
        component: node.component,
        onClick: node.onClick,
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
