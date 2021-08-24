import React, { JSXElementConstructor } from 'react';
import { Graph, Shape, Node } from '@antv/x6';
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

export type MakeSvgNode = (
  x: number,
  y: number,
  title?: string,
  onClick?: () => void
) => Node.Metadata;

export interface AntvCanvasProps<T> {
  canvas: Graph;
  components?: Record<string, JSXElementConstructor<T>>;
  svgNodes?: Record<string, MakeSvgNode>;
  flowGraph: FlowGraph;
}

export class AntvCanvas<T> implements ICanvas {
  canvas: Graph;
  components: Record<string, JSXElementConstructor<T>>;
  svgNodes: Record<string, MakeSvgNode>;
  flowGraph: FlowGraph;

  constructor(props: AntvCanvasProps<T>) {
    this.flowGraph = props.flowGraph;
    this.canvas = props.canvas;
    this.components = props.components || {};
    this.svgNodes = props.svgNodes || {};
  }

  protected makeNode = (nodeProps: NodeProps) => {
    const { type, component: componentName, ...node } = nodeProps;
    if (this.components[componentName]) {
      const component = this.components[componentName];
      return {
        ...node,
        shape: 'react-shape',
        component,
      };
    }
    if (this.svgNodes[componentName]) {
      return {
        id: node.id,
        ...this.svgNodes[componentName](
          node.x,
          node.y,
          node.label,
          node.onClick
        ),
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
