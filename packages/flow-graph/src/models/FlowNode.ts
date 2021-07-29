import { FlowGraph } from './FlowGraph';
import { uid } from '../shared';
import { FlowNodeType, NodeProps } from '../types';
import { IContextMenuItem } from '../canvas';

const CYCLE_FLOW_WIDTH = 40;

export interface IFlowNodeProps extends Omit<NodeProps, 'id'> {
  id?: string;
  type: FlowNodeType;
  width: number;
  height: number;
  x: number;
  y: number;
  targets?: string[];
  component?: string;
  contenxtMenu?: IContextMenuItem[];
}

export class FlowNode {
  id: string;
  type: FlowNodeType;
  width: number;
  height: number;
  flowGraph: FlowGraph;
  x: number;
  y: number;
  targets?: string[];
  component?: string;
  contenxtMenu?: IContextMenuItem[];

  constructor(props: IFlowNodeProps, flowGraph: FlowGraph) {
    this.id = props.id || uid();
    this.type = props.type || 'forward';
    this.width = props.width || 100;
    this.height = props.height || 100;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.targets = props.targets;
    this.component = props.component;
    this.contenxtMenu = props.contenxtMenu;
    this.flowGraph = flowGraph;
  }

  setPostion(x: number, y: number) {
    this.x = x;
    this.y = y;
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
    return ['cycleBegin', 'forkBegin'].includes(this.type);
  }

  get isAreaBegin() {
    return ['cycleBegin', 'forkBegin'].includes(this.type);
  }

  get isAreaEnd() {
    return ['cycleEnd', 'forkEnd'].includes(this.type);
  }

  get nextNodes() {
    return (this.targets || []).map((target) => this.flowGraph.getNode(target));
  }

  get areaEndNode() {
    return this.flowGraph.getNextAreaEnd(this.id);
  }

  get innerNodes() {
    if (this.isAreaBegin && this.areaEndNode) {
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
    return (
      this.innerNodes.filter((node) => node.type === 'cycleBegin').length +
      (this.type === 'cycleBegin' ? 1 : 0)
    );
  }

  get cycleEnd(): FlowNode | undefined {
    if (this.type === 'cycleBegin') {
      return this.areaEndNode;
    }
    return undefined;
  }

  get cycleBegin(): FlowNode | undefined {
    if (this.type === 'cycleEnd') {
      return Object.keys(this.flowGraph.nodeMap)
        .map((key) => this.flowGraph.getNode(key))
        .find((node) => node.cycleEnd === this);
    }
    if (this.type === 'cycleBack' && this.targets && this.targets[0]) {
      return this.flowGraph.getNode(this.targets[0]).cycleBegin;
    }
    return undefined;
  }
}
