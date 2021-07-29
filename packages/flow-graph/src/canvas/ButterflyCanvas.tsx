import React, { JSXElementConstructor } from 'react';
import { Canvas } from 'butterfly-dag';
import { ICanvas } from './Canvas';
import { EdgeProps, NodeProps } from '../types';

export interface ButterflyCanvasProps<T> {
  canvas: Canvas;
  components?: Record<string, JSXElementConstructor<T>>;
}

export class ButterflyCanvas<T = any> implements ICanvas {
  canvas: Canvas;
  components: Record<string, JSXElementConstructor<T>>;

  constructor(props: ButterflyCanvasProps<T>) {
    this.canvas = props.canvas;
    this.components = props.components || {};
  }

  protected makeNode = (nodeProps: NodeProps) => {
    const { component, ...node } = nodeProps;
    // const NodeRender = this.components[component]
    if (component) {
      return {
        id: node.id,
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        render() {
          return <div>the node component</div>;
        },
      };
    }
    return {
      ...node,
    };
  };

  addNode(node: NodeProps) {
    this.canvas.addNode(this.makeNode(node));
  }

  addNodes(nodes: NodeProps[]) {
    this.canvas.addNodes(nodes.map((node) => this.makeNode(node)));
  }

  addEdge(edge: EdgeProps) {
    this.canvas.addEdge(edge);
  }

  addEdges(edges: EdgeProps[]) {
    this.canvas.addEdges(edges);
  }
}
