import ELK, { ElkNode } from 'elkjs';
import { FlowNode, IFlowNodeProps } from './FlowNode';
import { uid } from '../shared';

const elk = new ELK({});

const StandardWidth = 30;
const LableWidth = StandardWidth * 3;
const LableHeight = StandardWidth * 2;
const NodeSpace = StandardWidth;

export interface IFlowGraphProps {
  id?: string;
  nodes?: IFlowNodeProps[];
}

export class FlowGraph {
  id: string;
  nodeMap: Record<string, FlowNode> = {};
  graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'mrtree',
      'elk.spacing.nodeNode': NodeSpace.toString(),
    },
    children: [],
    edges: [],
  };

  constructor(props: IFlowGraphProps) {
    this.id = props.id || uid();
    (props.nodes || []).forEach((node) => {
      this.addNode(node);
    });
  }

  get nodes() {
    return Object.keys(this.nodeMap).map((key) => this.nodeMap[key]);
  }

  setNodes(nodes: IFlowNodeProps[]) {
    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  addNode(node: IFlowNodeProps) {
    const flowNode = new FlowNode(node, this);
    this.nodeMap[flowNode.id] = flowNode;

    this.graph.children?.push({
      id: flowNode.id,
      width: flowNode.width,
      height: flowNode.height,
      labels: flowNode.label
        ? [{ text: flowNode.label, width: LableWidth, height: LableHeight }]
        : undefined,
      layoutOptions: {
        'elk.nodeLabels.placement': '[H_RIGHT V_CENTER OUTSIDE]',
      },
    });
    (flowNode.targets || []).forEach((target) => {
      this.graph.edges?.push({
        id: uid(),
        sources: [flowNode.id],
        targets: [target.id],
        labels: [{ text: target.label }],
      });
    });
    // if (flowNode.loopBackTarget) {
    //   this.graph.edges?.push({
    //     id: uid(),
    //     sources: [flowNode.loopBackTarget],
    //     targets: [flowNode.id],
    //     labels: [{ text: 'Loop Back' }],
    //   });
    // }
    // if (flowNode.loopEndTarget) {
    //   this.graph.edges?.push({
    //     id: uid(),
    //     sources: [flowNode.id],
    //     targets: [flowNode.loopEndTarget],
    //     labels: [{ text: 'Loop Out' }],
    //   });
    // }
  }

  async elkLayout() {
    await elk.layout(this.graph).then((graph) => {
      graph.children?.forEach((child) => {
        if ((child.labels ?? []).length > 0) {
          child.x = LableWidth / 2 + (child.x ?? 0);
        }
        this.nodeMap[child.id].setPostion(child.x ?? 0, child.y ?? 0);
      });
    });
  }

  layout() {
    const opts = {
      fork: true,
    };
    // const opts = null;
    // dagre.layout(this.dg, opts as any);
    // this.dg.nodes().forEach((nodeId) => {
    //   const pos = this.dg.node(nodeId);
    //   this.nodeMap[nodeId].setPostion(pos.x, pos.y);
    // });
    // Object.keys(this.nodeMap).forEach((id) => {
    //   this.dg.setNode(id, {
    //     width: this.nodeMap[id].areaWidth / 2,
    //     height: this.nodeMap[id].height,
    //   });
    // });
    // dagre.layout(this.dg, opts as any);
    // this.dg.nodes().forEach((nodeId) => {
    //   const pos = this.dg.node(nodeId);
    // if (
    //   this.nodeMap[nodeId].component === 'ExtendNode' ||
    //   this.nodeMap[nodeId].component === 'LabelNode'
    // ) {
    //   const height = this.nodeMap[nodeId].height / 4;
    //   if (this.nodeMap[nodeId].type === 'loopBack') {
    //     this.nodeMap[nodeId].setPostion(
    //       pos.x + this.nodeMap[nodeId].width / 4,
    //       pos.y
    //     );
    //   } else if (this.nodeMap[nodeId].type === 'loopEnd') {
    //     this.nodeMap[nodeId].setPostion(
    //       pos.x + this.nodeMap[nodeId].width / 4,
    //       pos.y + this.nodeMap[nodeId].height / 1.5
    //     );
    //   } else {
    //     this.nodeMap[nodeId].setPostion(
    //       pos.x + this.nodeMap[nodeId].width / 4,
    //       pos.y - height
    //     );
    //   }
    //   this.nodeMap[nodeId].setSize(
    //     this.nodeMap[nodeId].width / 2,
    //     this.nodeMap[nodeId].height / 2
    //   );
    // } else {
    // this.nodeMap[nodeId].setPostion(pos.x, pos.y);
    // }
    //   this.nodeMap[nodeId].setPostion(pos.x, pos.y);
    // });
  }

  getNode(id: string) {
    return this.nodeMap[id];
  }

  getNextArea(id: string): FlowNode | undefined {
    const nexts = this.nodeMap[id]?.targets;
    if (nexts && nexts.length > 0) {
      const nextNode = this.getNode(nexts[0].id);
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
      const nextNode = this.getNode(nexts[0].id);
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
      const nextNode = this.getNode(nexts[0].id);
      const isAreaEnd = Object.keys(this.nodeMap)
        .map((key) => this.getNode(key))
        .find(
          (node) =>
            nexts &&
            (node.loopEndTarget === nexts[0].id ||
              node.decisionEndTarget === nexts[0].id)
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
    return Array.from(new Set(innerNodes));
  }

  async layoutData() {
    await this.elkLayout();
    return {
      nodes: Object.keys(this.nodeMap).map((key) => this.nodeMap[key]),
      edges: this.graph.edges ?? [],
    };
  }
}
