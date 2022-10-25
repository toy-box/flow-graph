import dagre from '@toy-box/dagre';
// import dagre from 'dagre';
import { FlowNode, IFlowNodeProps, TargetProps, TargetType } from './FlowNode';
import { uid } from '../shared';
import { UpdateNodeProps } from './Flow';

export interface IFlowGraphProps {
  id?: string;
  nodes?: IFlowNodeProps[];
  standardSize?: number;
}

export class FlowGraph {
  id: string;
  nodeMap: Record<string, FlowNode> = {};
  dg: dagre.graphlib.Graph;
  standardSize: number;

  constructor(props: IFlowGraphProps) {
    this.id = props.id || uid();
    this.standardSize = props.standardSize ?? 20;
    // dg
    this.dg = new dagre.graphlib.Graph();
    this.dg.setGraph(this.config);
    this.dg.setDefaultEdgeLabel(() => ({}));

    (props.nodes || []).forEach((node) => {
      this.addNode(node);
    });
  }

  get config() {
    return {
      rankdir: 'TB',
      ranker: 'short-tree',
      nodesep: this.standardSize * 6,
      ranksep: this.standardSize * 4,
    };
  }

  get shadowSize() {
    return this.standardSize;
  }

  get nodeSize() {
    return this.standardSize * 3;
  }

  get nodes() {
    return Object.keys(this.nodeMap).map((key) => this.nodeMap[key]);
  }

  get shadowNodes() {
    return this.nodes.filter((node) => node.type === 'shadow');
  }

  setNodes(nodes: IFlowNodeProps[]) {
    this.dg = new dagre.graphlib.Graph();
    this.dg.setGraph(this.config);
    this.dg.setDefaultEdgeLabel(() => ({}));
    this.nodeMap = {};
    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  addNodeAt(at: string, node: IFlowNodeProps) {
    const atNode = this.nodeMap[at];
    if (atNode) {
      // const newExtendNode = this.addNod
      const newNode = this.addNode({
        ...node,
      });
      this.setTarget(at, [{ id: newNode.id }]);
    }
  }

  addNode(node: IFlowNodeProps) {
    // const isDecision =
    //   node.type === 'decisionBegin' || node.type === 'decisionEnd';
    const isDecision = false;
    let flowNode: FlowNode;
    let shadowNode: FlowNode;
    if (!isDecision) {
      flowNode = new FlowNode(node, this);
      this.nodeMap[flowNode.id] = flowNode;
      this.dg.setNode(flowNode.id, {
        width: flowNode.width,
        height: flowNode.height,
      });

      (flowNode.targets || []).forEach((target) => {
        this.dg.setEdge(flowNode.id, target.id, {
          id: uid(),
        });
      });
    } else {
      // has shadow node
      if (node.type === 'decisionBegin') {
        shadowNode = new FlowNode(
          {
            ...node,
            id: uid(),
            type: 'shadow',
            width:
              this.nodeSize * (node.targets || []).length +
              this.config.nodesep * ((node.targets || []).length - 1),
            height: this.shadowSize,
          },
          this
        );
        flowNode = new FlowNode({ ...node, shadowNode: shadowNode.id }, this);
        this.nodeMap[flowNode.id] = flowNode;
        this.nodeMap[shadowNode.id] = shadowNode;
        this.dg.setNode(flowNode.id, {
          width: flowNode.width,
          height: flowNode.height,
        });

        this.dg.setNode(shadowNode.id, {
          width: shadowNode.width,
          height: shadowNode.height,
        });
        this.dg.setEdge(flowNode.id, shadowNode.id, { id: uid() });
        (flowNode.targets || []).forEach((target) => {
          this.dg.setEdge(shadowNode.id, target.id, { id: uid() });
        });
      } else {
        flowNode = new FlowNode(node, this);
        this.nodeMap[flowNode.id] = flowNode;
        this.dg.setNode(flowNode.id, {
          width: flowNode.width,
          height: flowNode.height * 2,
        });
        (flowNode.targets || []).forEach((target) => {
          this.dg.setEdge(flowNode.id, target.id, { id: uid() });
        });
      }
    }
    return flowNode;
  }

  addNodes(nodes: IFlowNodeProps[]) {
    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  updateNode(updateNode: UpdateNodeProps) {
    const { id, ...others } = updateNode;
    let node = this.nodeMap[id];
    if (node) {
      for (const key in others) {
        node[key] = others[key];
      }
    }
  }

  setTarget(id: string, targets: TargetProps[] = []) {
    if (this.nodeMap[id]) {
      this.nodeMap[id].targets?.forEach((target) => {
        this.dg.removeEdge(id, target.id);
      });
      this.nodeMap[id].targets = targets;
      targets.forEach((target) => {
        this.dg.setEdge(id, target.id);
      });
    }
  }

  removeNode(id: string) {
    const node = this.nodeMap[id];
    const parents = this.nodes.filter((node) => node.isParentOf(id));
    if (node.areaOutNode) {
      const targets = node.areaOutNode.targets;
      parents.forEach((parent) => {
        this.setTarget(parent.id, targets);
      });
    }
    // 移除关联节点
    if (node) {
      node.bindNodes
        .map((node) => node.id)
        .forEach((key) => {
          this.dg.removeNode(key);
          this.nodeMap[key].targets?.forEach((target) => {
            this.dg.removeEdge(key, target.id);
          });
          delete this.nodeMap[key];
        });
    }
  }

  removeNodes(ids: string[]) {
    ids.forEach((id) => this.removeNode(id));
  }

  layout() {
    this.nodes
      .filter((node) => node.isAreaBegin)
      .forEach((node) => {
        this.dg.setNode(node.id, {
          width: node.areaWidth,
          height: node.height,
        });
      });
    dagre.layout(this.dg);
    this.dg.nodes().forEach((nodeId) => {
      const pos = this.dg.node(nodeId);
      if (this.nodeMap[nodeId]) {
        if (this.nodeMap[nodeId].component === 'ExtendNode') {
          this.nodeMap[nodeId].setPostion(
            pos.x + this.standardSize,
            pos.y + this.standardSize
          );
        } else {
          if (
            this.nodes.some(
              (node) =>
                this.nodeMap[node.id].component === 'ExtendNode' &&
                node.targets?.some((target) => target.id === nodeId)
            )
          ) {
            this.nodeMap[nodeId].setPostion(pos.x, pos.y);
          } else {
            this.nodeMap[nodeId].setPostion(pos.x, pos.y);
          }
        }
      }
    });
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
      const isAreaEnd = this.nodes.find(
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
    if (
      nexts.some((node) => {
        if (node == null) {
          console.log('inner', begin, end, nexts);
        }
        return node.id === end.id;
      })
    ) {
      return Array.from(new Set(innerNodes));
    }
    nexts.forEach((next) => {
      innerNodes.push(...this.getInnerNodes(next, end));
    });
    return Array.from(new Set(innerNodes));
  }

  layoutData() {
    this.layout();
    // this.layout();
    return {
      nodes: this.nodes.filter((node) => node.type !== 'shadow'),
      edges: this.dg
        .edges()
        .filter((edge) => !this.shadowNodes.some((node) => edge.w === node.id))
        .map((edge) => {
          if (this.shadowNodes.some((node) => edge.v === node.id)) {
            const origin = this.nodes.find(
              (node) => node.shadowNode === edge.v
            );
            return { ...edge, v: origin?.id as string };
          }
          return edge;
        }),
    };
  }
}
