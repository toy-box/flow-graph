import { FlowGraph } from './FlowGraph';
import { uid } from '../shared';
import { FlowNodeType, NodeProps } from '../types';

const CYCLE_FLOW_WIDTH = 50;

export type TargetType = string | TargetProps;

export interface TargetProps {
  id: string;
  label?: string;
}

export interface IFlowNodeProps extends Omit<NodeProps, 'id' | 'x' | 'y'> {
  id?: string;
  type: FlowNodeType;
  width: number;
  height: number;
  x?: number;
  y?: number;
  label?: string;
  targets?: TargetType[];
  component?: string;
  decisionEndTarget?: string;
  loopBackTarget?: string;
  loopEndTarget?: string;
}

export class FlowNode {
  id: string;
  type: FlowNodeType;
  width: number;
  height: number;
  flowGraph: FlowGraph;
  x: number;
  y: number;
  label?: string;
  targets?: TargetProps[];
  component?: string;
  decisionEndTarget?: string;
  loopBackTarget?: string;
  loopEndTarget?: string;

  constructor(props: IFlowNodeProps, flowGraph: FlowGraph) {
    this.id = props.id || uid();
    this.type = props.type || 'forward';
    this.width = props.width || 100;
    this.height = props.height || 100;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.label = props.label;
    this.targets = props.targets?.map((target) =>
      typeof target === 'string' ? { id: target } : target
    );
    this.component = props.component;
    this.loopBackTarget = props.loopBackTarget;
    this.loopEndTarget = props.loopEndTarget;
    this.decisionEndTarget = props.decisionEndTarget;
    this.flowGraph = flowGraph;
  }

  setPostion(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.x - this.width / 2;
  }

  get right() {
    return this.x + this.width / 2;
  }

  get centerX() {
    return this.x + this.width / 2;
  }

  get centerY() {
    return this.y + this.height / 2;
  }

  get isAreaNode() {
    return this.type === 'loopBegin' || (this.targets ?? []).length > 0;
  }

  get isAreaBegin() {
    return this.isAreaNode;
  }

  get isAreaEnd() {
    return ['loopEnd', 'decisionEnd', 'end'].includes(this.type);
  }

  get nextNodes() {
    return (this.targets || []).map((target) =>
      this.flowGraph.getNode(target.id)
    );
  }

  get areaEndNode() {
    return this.flowGraph.getNextAreaEnd(this.id);
  }

  get innerNodes() {
    // if (this.type === 'loopBegin') {

    // }
    if (this.areaEndNode) {
      return this.flowGraph.getInnerNodes(this, this.areaEndNode);
    }
    return [];
  }

  get areaWidth(): number {
    if (this.innerNodes.length > 0) {
      const leftNode = this.innerNodes.reduce((prev, current) =>
        prev.left > current.left ? current : prev
      );
      const rightNode = this.innerNodes.reduce((prev, current) =>
        prev.right < current.right ? current : prev
      );
      return (
        rightNode.right -
        leftNode.left +
        this.innerCycles * CYCLE_FLOW_WIDTH * 2
      );
    }
    return this.width;
  }

  get innerCycles() {
    const nodeLength = this.innerNodes.filter(
      (node) => node.type === 'loopBegin'
    ).length;
    return nodeLength + (this.type === 'loopBegin' ? 1 : 0);
  }

  get loopEnd(): FlowNode | undefined {
    if (this.type === 'loopBegin') {
      return this.areaEndNode;
    }
    return undefined;
  }

  get loopBegin() {
    return this.flowGraph.nodes.find(
      (node) =>
        node.loopBackTarget === this.id || node.loopEndTarget === this.id
    );
  }

  get decisionEnd() {
    const decisionEnd1 = Object.keys(this.flowGraph.nodeMap)
      .map((key) => this.flowGraph.getNode(key))
      .find(
        (node) => this.targets && node.decisionEndTarget === this.targets[0].id
      );
    return decisionEnd1;
  }
}
