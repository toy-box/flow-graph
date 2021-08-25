import { FlowGraph } from './FlowGraph';
import { uid } from '../shared';
import { FlowNodeType, NodeProps } from '../types';
import { IContextMenuItem } from '../canvas';

const CYCLE_FLOW_WIDTH = 50;

export interface IFlowNodeProps extends Omit<NodeProps, 'id'> {
  id?: string;
  type: FlowNodeType;
  width: number;
  height: number;
  x: number;
  y: number;
  label?: string;
  targets?: string[];
  component?: string;
  decisionEndTarget?: string;
  loopBackTarget?: string;
  loopEndTarget?: string;
  contenxtMenu?: IContextMenuItem[];
  onClick?: () => void;
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
  targets?: string[];
  component?: string;
  decisionEndTarget?: string;
  loopBackTarget?: string;
  loopEndTarget?: string;
  contenxtMenu?: IContextMenuItem[];
  onClick?: () => void;

  constructor(props: IFlowNodeProps, flowGraph: FlowGraph) {
    this.id = props.id || uid();
    this.type = props.type || 'forward';
    this.width = props.width || 100;
    this.height = props.height || 100;
    this.x = props.x || 0;
    this.y = props.y || 0;
    (this.label = props.label), (this.targets = props.targets);
    this.component = props.component;
    this.loopBackTarget = props.loopBackTarget;
    this.loopEndTarget = props.loopEndTarget;
    this.decisionEndTarget = props.decisionEndTarget;
    this.contenxtMenu = props.contenxtMenu;
    this.onClick = props.onClick;
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
    return ['loopBegin', 'decisionBegin'].includes(this.type);
  }

  get isAreaBegin() {
    return ['loopBegin', 'decisionBegin'].includes(this.type);
  }

  get isAreaEnd() {
    return ['loopEnd', 'decisionEnd'].includes(this.type);
  }

  get nextNodes() {
    return (this.targets || []).map((target) => this.flowGraph.getNode(target));
  }

  get areaEndNode() {
    return this.flowGraph.getNextAreaEnd(this.id);
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
    if (this.type === 'loopBegin') {
      return this.areaEndNode;
    }
    return undefined;
  }

  get loopBegin(): FlowNode | undefined {
    // if (this.type === 'loopEnd') {
    //   return Object.keys(this.flowGraph.nodeMap)
    //     .map((key) => this.flowGraph.getNode(key))
    //     .find((node) => node.loopEnd === this);
    // }
    // if (this.type === 'loopBack' && this.targets && this.targets[0]) {
    //   console.log(this.flowGraph.getNode(this.targets[0]));
    //   return this.flowGraph.getNode(this.targets[0]).loopBegin;
    // }
    return Object.keys(this.flowGraph.nodeMap)
      .map((key) => this.flowGraph.getNode(key))
      .find((node) => node.loopBackTarget === this.id);
  }

  get decisionEnd(): FlowNode | undefined {
    const decisionEnd1 = Object.keys(this.flowGraph.nodeMap)
      .map((key) => this.flowGraph.getNode(key))
      .find(
        (node) => this.targets && node.decisionEndTarget === this.targets[0]
      );
    return decisionEnd1;
  }
}
