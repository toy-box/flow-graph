import dagre from '@toy-box/dagre';
import { FlowNode, IFlowNodeProps } from './FlowNode';
import { uid } from '../shared';

export interface IFlowGraphProps {
  id?: string;
  nodes?: IFlowNodeProps[];
}

const DAGRE_CONFIG = {
  rankdir: 'TB',
  ranker: 'short-tree',
  nodesep: 140,
  ranksep: 100,
};

export class FlowGraph {
  id: string;
  nodeMap: Record<string, FlowNode> = {};
  dg: dagre.graphlib.Graph;

  constructor(props: IFlowGraphProps) {
    this.id = props.id || uid();
    this.dg = new dagre.graphlib.Graph();
    this.dg.setGraph(DAGRE_CONFIG);
    this.dg.setDefaultEdgeLabel(() => ({}));
    (props.nodes || []).forEach((node) => {
      this.addNode(node);
    });
  }

  setNodes(nodes: IFlowNodeProps[]) {
    this.dg = new dagre.graphlib.Graph();
    this.dg.setGraph(DAGRE_CONFIG);
    this.dg.setDefaultEdgeLabel(() => ({}));
    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  addNode(node: IFlowNodeProps) {
    const flowNode = new FlowNode(node, this);
    this.nodeMap[flowNode.id] = flowNode;
    this.dg.setNode(flowNode.id, {
      width: flowNode.width,
      height: flowNode.height,
    });
    (flowNode.targets || []).forEach((target) => {
      this.dg.setEdge(flowNode.id, target, { id: uid() });
    });
  }

  layout() {
    const opts = {
      fork: true,
    };
    // const opts = null;
    dagre.layout(this.dg, opts as any);
    this.dg.nodes().forEach((nodeId) => {
      const pos = this.dg.node(nodeId);
      this.nodeMap[nodeId].setPostion(pos.x, pos.y);
    });
    Object.keys(this.nodeMap).forEach((id) => {
      this.dg.setNode(id, {
        width: this.nodeMap[id].areaWidth,
        height: this.nodeMap[id].height,
      });
    });
    dagre.layout(this.dg, opts as any);
    this.dg.nodes().forEach((nodeId) => {
      const pos = this.dg.node(nodeId);
      if (this.nodeMap[nodeId].component === 'ExtendNode') {
        if (this.nodeMap[nodeId].type === 'loopBack') {
          this.nodeMap[nodeId].setPostion(
            pos.x + this.nodeMap[nodeId].width / 4,
            pos.y
          );
        } else {
          this.nodeMap[nodeId].setPostion(
            pos.x + this.nodeMap[nodeId].width / 4,
            pos.y + this.nodeMap[nodeId].height / 4
          );
        }
        this.nodeMap[nodeId].setSize(
          this.nodeMap[nodeId].width / 2,
          this.nodeMap[nodeId].height / 2
        );
      } else {
        this.nodeMap[nodeId].setPostion(pos.x, pos.y);
      }
    });
  }

  getNode(id: string) {
    return this.nodeMap[id];
  }

  getNextArea(id: string): FlowNode | undefined {
    const nexts = this.nodeMap[id]?.targets;
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0]);
      if (nextNode.isAreaNode) {
        return nextNode;
      }
      return this.getNextArea(nextNode.id);
    }
    return undefined;
  }

  getNextAreaBegin(id: string, deep: number = 0): FlowNode | undefined {
    const nexts = this.nodeMap[id]?.targets;
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0]);
      if (nextNode.isAreaBegin) {
        return this.getNextAreaBegin(nextNode.id, deep + 1);
      }
      if (nextNode.isAreaEnd) {
        return deep === 0
          ? nextNode
          : this.getNextAreaBegin(nextNode.id, deep - 1);
      }
      return this.getNextAreaBegin(nextNode.id, deep);
    }
    return undefined;
  }

  getNextAreaEnd(id: string, deep: number = 0): FlowNode | undefined {
    let nexts = this.nodeMap[id]?.targets;
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0]);
      const isAreaEnd = Object.keys(this.nodeMap)
        .map((key) => this.getNode(key))
        .find(
          (node) =>
            nexts &&
            (node.loopEndTarget === nexts[0] ||
              node.decisionEndTarget === nexts[0])
        );
      if (nextNode.isAreaBegin) {
        return this.getNextAreaEnd(nextNode.id, deep + 1);
      }
      if (isAreaEnd) {
        return deep === 0
          ? nextNode
          : this.getNextAreaEnd(nextNode.id, deep - 1);
      }
      return this.getNextAreaEnd(nextNode.id, deep);
    }
    return undefined;
  }

  getInnerNodes(begin: FlowNode, end: FlowNode) {
    const node = this.nodeMap[begin.id];
    const innerNodes: FlowNode[] = [];
    const nexts = node.nextNodes;
    innerNodes.push(...nexts);
    if (nexts.some((node) => node.id === end.id)) {
      return Array.from(new Set(innerNodes));
    }
    nexts.forEach((next) => {
      innerNodes.push(...this.getInnerNodes(next, end));
    });
    // const isAreaEnd = Object.keys(this.nodeMap)
    //   .map((key) => this.getNode(key))
    //   .find(
    //     (node) =>
    //       node.loopEndTarget === begin.id
    //   );
    // if (isAreaEnd) {
    //   return Array.from(new Set(innerNodes));
    // }
    return Array.from(new Set(innerNodes));
  }

  layoutData() {
    this.layout();
    return {
      nodes: Object.keys(this.nodeMap).map((key) => this.nodeMap[key]),
      edges: this.dg.edges(),
    };
  }
}
