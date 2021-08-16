import React, { JSXElementConstructor } from 'react';
import { Graph, Shape } from '@antv/x6';
import { ICanvas } from './Canvas';
import { NodeProps, EdgeProps } from '../types';
import { FlowGraph } from '../models';

Shape.Edge.config({
  attrs: {
    line: {
      targetMarker: null,
      strokeWidth: 6,
      stroke: '#d9d9d9',
    },
  },
  connector: {
    name: 'rounded',
    args: {
      radius: 20,
    },
  },
});

export interface AntvCanvasProps<T> {
  canvas: Graph;
  components?: Record<string, JSXElementConstructor<T>>;
  flowGraph: FlowGraph;
}

export class AntvCanvas<T> implements ICanvas {
  canvas: Graph;
  components: Record<string, JSXElementConstructor<T>>;
  flowGraph: FlowGraph;

  constructor(props: AntvCanvasProps<T>) {
    this.flowGraph = props.flowGraph;
    this.canvas = props.canvas;
    this.components = props.components || {};
  }

  protected makeNode = (nodeProps: NodeProps) => {
    const { type, component: componentName, ...node } = nodeProps;
    const component = this.components[componentName];
    if (component) {
      return {
        ...node,
        shape: 'react-shape',
        component,
      };
    }
    return {
      ...node,
      label: node.id,
    };
  };

  addNode(node: NodeProps) {
    this.canvas.unfreeze();
    this.canvas.addNode(this.makeNode(node));
    this.canvas.freeze();
  }

  addNodes(nodes: NodeProps[]) {
    this.canvas.unfreeze();
    this.canvas.addNodes(nodes.map((node) => this.makeNode(node)));
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
