import { Graph, Node, Edge } from '@antv/x6';
import { JSXElementConstructor } from 'react';

export interface NodeProps extends Node.Metadata {
  type: string;
}

export interface FlowCanavsProps<T> {
  canvas: Graph;
  components?: Record<string, JSXElementConstructor<T>>;
}

export class FlowCanavs<T> {
  canvas: Graph;
  components: Record<string, JSXElementConstructor<T>>;

  constructor(props: FlowCanavsProps<T>) {
    this.canvas = props.canvas;
    this.components = props.components || {};
  }

  protected makeNode = (nodeProps: NodeProps) => {
    const { type, ...node } = nodeProps;
    const component = this.components[type];
    if (component) {
      return {
        ...node,
        shape: 'react-shape',
        component,
      };
    }
    return {
      ...node,
    };
  };

  addNode(node: NodeProps) {
    this.canvas.unfreeze();
    this.canvas.addNode(this.makeNode(node));
    this.canvas.freeze();
  }

  addNodes(nodes: NodeProps[]) {
    this.canvas.unfreeze();
    this.canvas.addEdges(nodes.map((node) => this.makeNode(node)));
    this.canvas.freeze();
  }

  addEdge(edge: Edge.Metadata) {
    this.canvas.unfreeze();
    this.canvas.addEdge(edge);
    this.canvas.freeze();
  }

  addEdges(edges: Edge.Metadata[]) {
    this.canvas.unfreeze();
    this.canvas.addEdges(edges);
    this.canvas.freeze();
  }
}
