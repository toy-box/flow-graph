import { FlowGraph } from './FlowGraph';
import { uid } from '../shared';
import { FlowNodeType, INodeProps } from '../types';

const CYCLE_FLOW_WIDTH = 50;

export type TargetType = string | TargetProps;

export interface TargetProps {
  id: string;
  label?: string;
}

export interface IFlowNodeProps extends Omit<INodeProps, 'id' | 'x' | 'y'> {
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
  shadowNode?: string;
  data?: Record<string, any>;
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
  shadowNode?: string;
  data?: Record<string, any>;

  constructor(props: IFlowNodeProps, flowGraph: FlowGraph) {
    this.id = props.id || uid();
    this.type = props.type || 'forward';
    this.width = props.width;
    this.height = props.height;
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
    this.shadowNode = props.shadowNode;
    this.flowGraph = flowGraph;
    this.data = props.data;
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
    return this.isloopEnd || this.decisionEnd;
  }

  get nextNodes() {
    return (this.targets || []).map((target) =>
      this.flowGraph.getNode(target.id)
    );
  }

  get areaEndNode() {
    return this.decisionEnd || this.loopEnd;
  }

  get innerNodes() {
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
    return this.flowGraph.nodes.find((node) => node.id === this.loopEndTarget);
  }

  get loopBegin() {
    return this.flowGraph.nodes.find(
      (node) =>
        node.loopBackTarget === this.id || node.loopEndTarget === this.id
    );
  }

  get isloopBack() {
    return this.flowGraph.nodes.find((node) => node.loopBackTarget === this.id);
  }

  get isloopEnd() {
    return this.flowGraph.nodes.find((node) => node.loopEndTarget === this.id);
  }

  get decisionEnd() {
    return this.flowGraph.nodes.find(
      (node) => this.targets && node.decisionEndTarget === this.targets[0].id
    );
  }
}
