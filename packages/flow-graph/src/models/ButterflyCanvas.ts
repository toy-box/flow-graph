import { JSXElementConstructor } from 'react';
import { Canvas } from 'butterfly-dag';
import { ICanvas } from './Canvas';
import { EdgeProps, NodeProps } from '../types';

export interface ButterflyCanvasProps<T> {
  canvas: Canvas;
  components?: Record<string, JSXElementConstructor<T>>;
}

export class ButterflyCanvas<T> implements ICanvas {
  canvas: Canvas;
  components: Record<string, JSXElementConstructor<T>>;

  constructor(props: ButterflyCanvasProps<T>) {
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

  addEdge(edge: EdgeProps) {
    this.canvas.unfreeze();
    this.canvas.addEdge(edge);
    this.canvas.freeze();
  }

  addEdges(edges: EdgeProps[]) {
    this.canvas.unfreeze();
    this.canvas.addEdges(edges);
    this.canvas.freeze();
  }
}
