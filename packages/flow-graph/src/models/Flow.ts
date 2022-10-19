import '@antv/x6-react-shape';
import { action, batch, define, observable } from '@formily/reactive';
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
    source.targets[centerIdx].id === target.id
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
  console.log('makeRightCycleVertices', source, target);
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
  loopBackTargetNode: FlowNode
) => {
  let width =
    target.areaWidth > source.areaWidth ? target.areaWidth : source.areaWidth;
  if (
    (source.targets &&
      source.loopBackTarget === source.targets[0].id &&
      target.type === 'loopEnd') ||
    !source.loopBegin
  ) {
    width = source.areaWidth + 30;
  }
  const height = loopBackTargetNode.centerY;
  return [
    { x: source.centerX - width / 2, y: source.centerY },
    {
      x: source.centerX - width / 2,
      y: height + loopBackTargetNode.height * 1.5,
    },
    { x: source.centerX, y: height + loopBackTargetNode.height * 1.5 },
  ];
};

export class Flow {
  id: string;
  flowGraph: FlowGraph;
  canvas?: ICanvas;

  constructor() {
    this.id = uid();
    this.flowGraph = new FlowGraph({});
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
      this.flowGraph.layoutData().then((layout) => {
        layout.nodes.forEach((node) => this.addGraphNode(node));
        layout.edges.forEach((edge) => {
          const sourceNode = this.flowGraph.getNode(edge.sources[0]);
          const targetNode = this.flowGraph.getNode(edge.targets[0]);
          if (sourceNode.type == 'loopBack' && targetNode.type === 'loopEnd') {
            if (sourceNode.loopBegin) {
              // Loop out edge
              this.addGraphEdge({
                source: sourceNode.loopBegin.id,
                target: edge.targets[0],
                label: 'Loop out',
                sourceHandle: 'right',
                targetHandle: 'top',
              });
              // Loop cycle edge
              this.addGraphEdge({
                source: sourceNode.id,
                target: sourceNode.loopBegin.id,
                label: 'Loop cycle',
                sourceHandle: 'bottom',
                targetHandle: 'left',
              });
            }
          } else {
            this.addGraphEdge({
              source: edge.sources[0],
              target: edge.targets[0],
              label: edge.labels?.[0].text,
              sourceHandle: 'bottom',
              targetHandle: 'top',
            });
          }
          // if (
          //   targetNode.type === 'loopBegin' &&
          //   sourceNode.type === 'loopBack'
          // ) {
          //   const loopBackTargetNode = this.flowGraph.getNode(
          //     sourceNode.loopBackTarget as string
          //   );
          //   // loop cycle edge
          //   this.addGraphEdge({
          //     source: edge.sources[0],
          //     target: edge.targets[0],
          //     targetHandle: 'left',
          //     label: 'LoopCycle',
          //     // data: {
          //     //   vertices: makeLeftCycleVertices(
          //     //     sourceNode,
          //     //     sourceNode.loopBegin as FlowNode,
          //     //     loopBackTargetNode
          //     //   ),
          //     // },
          //   });
          // } else if (
          //   sourceNode.type === 'loopBegin' &&
          //   targetNode.type === 'loopEnd'
          // ) {
          //   // loop out edge
          //   this.addGraphEdge({
          //     source: edge.sources[0],
          //     target: edge.targets[0],
          //     sourceHandle: 'right',
          //     targetHandle: 'bottom',
          //     label: 'LoopOut',
          //     // data: {
          //     //   vertices: makeRightCycleVertices(
          //     //     sourceNode,
          //     //     sourceNode.loopEnd as FlowNode
          //     //   ),
          //     // },
          //   });
          // } else {
          //   this.addGraphEdge({
          //     source: edge.sources[0],
          //     target: edge.targets[0],
          //     label: edge.labels?.[0].text,
          //     sourceHandle: 'bottom',
          //     targetHandle: 'top',
          //   });
          // }
          // if (sourceNode.type === 'loopBegin' && sourceNode.loopEndTarget) {
          //   const loopEndTargetNode = this.flowGraph.getNode(
          //     sourceNode.loopEndTarget
          //   );
          //   const loopBackTargetNode = this.flowGraph.getNode(
          //     sourceNode.loopBackTarget as string
          //   );
          //   const targetId = loopBackTargetNode.targets?.[0].id as string;
          //   const targetNode = this.flowGraph.getNode(targetId);
          //   const target =
          //     targetNode.component === 'LabelNode' &&
          //     targetNode.type !== 'loopEnd'
          //       ? targetNode
          //       : loopEndTargetNode;
          //   this.addGraphEdges([
          //     {
          //       source: edge.sources[0],
          //       target: edge.targets[0],
          //       type: 'hyperEdge',
          //       label: edge.labels?.[0].text,
          //     },
          //     {
          //       source: edge.sources[0],
          //       target: target.id,
          //       type: 'hyperEdge',
          //       label: edge.labels?.[0].text,
          //       vertices: makeLeftCycleVertices(
          //         sourceNode,
          //         target,
          //         loopBackTargetNode
          //       ),
          //     },
          //   ]);
          // } else if (sourceNode.loopBegin) {
          //   if (sourceNode.loopBegin) {
          //     this.addGraphEdge({
          //       source: edge.sources[0],
          //       target: sourceNode.loopBegin.id,
          //       label: edge.labels?.[0].text,
          //       vertices: makeRightCycleVertices(
          //         sourceNode,
          //         sourceNode.loopBegin
          //       ),
          //     });
          //   }
          // } else if (sourceNode.type === 'decisionBegin') {
          //   this.addGraphEdge({
          //     source: edge.sources[0],
          //     target: edge.targets[0],
          //     label: edge.labels?.[0].text,
          //     vertices: makeForkVertices(sourceNode, targetNode),
          //   });
          // } else if (sourceNode.decisionEnd) {
          //   this.addGraphEdge({
          //     source: edge.sources[0],
          //     target: edge.targets[0],
          //     label: edge.labels?.[0].text,
          //     vertices: makeJoinVertices(sourceNode, targetNode),
          //   });
          // } else {
          //   this.addGraphEdge({
          //     source: edge.sources[0],
          //     target: edge.targets[0],
          //     label: edge.labels?.[0].text,
          //   });
          // }
        });
      });
    }
  }

  addGraphNode = (node: FlowNode) => {
    this.canvas?.addNode({
      id: node.id,
      type: node.type,
      x: node.x,
      y: node.y,
      label: node.label,
      width: node.width,
      height: node.height,
      component: node.component,
    });
  };

  addGraphEdge = (edge: EdgeProps) => {
    this.canvas?.addEdge(edge);
  };

  addGraphEdges = (edges: EdgeProps[]) => {
    this.canvas?.addEdges(edges);
  };
}
