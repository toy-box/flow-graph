import { JSXElementConstructor } from 'react';
import { Canvas } from 'butterfly-dag';
import { ICanvas } from './Canvas';

export interface NodeProps extends Node.Metadata {
  type: string;
}

export interface ButterflyCanavsProps<T> {
  canvas: Canvas;
  components?: Record<string, JSXElementConstructor<T>>;
}

export class AntvCanavs<T> implements ICanvas {
  canvas: Canvas;
  components: Record<string, JSXElementConstructor<T>>;

  constructor(props: ButterflyCanavsProps<T>) {
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
