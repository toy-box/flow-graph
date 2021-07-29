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
      stroke: '#cfcfcf',
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

  protected makeEdge(edge: EdgeProps) {
    return Object.assign(edge, {
      attrs: {
        stroke: 'red',
        strokeWidth: 3,
      },
    });
  }

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
    console.log('edge !!!', this.makeEdge(edge));
    this.canvas.unfreeze();
    this.canvas.addEdge(this.makeEdge(edge));
    this.canvas.freeze();
  }

  addEdges(edges: EdgeProps[]) {
    const _edges = edges.map((edge) => this.makeEdge(edge));
    console.log('edges !!!', _edges);
    this.canvas.unfreeze();
    this.canvas.addEdges(_edges);
    this.canvas.freeze();
  }
}
