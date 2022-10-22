import React, { JSXElementConstructor } from 'react';
import { action, batch, define, observable } from '@formily/reactive';
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge as flowAddEdge,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from 'reactflow';
import { ICanvas } from './Canvas';
import { NodeProps, EdgeProps } from '../types';
import { FlowGraph } from '../models';
import { uid } from '../shared';

import 'reactflow/dist/style.css';

export interface ReactFlowCanvasProps<T> {
  components?: Record<string, JSXElementConstructor<T>>;
  edgeComponents?: Record<string, JSXElementConstructor<T>>;
  flowGraph: FlowGraph;
}

export class ReactFlowCanvas<T> implements ICanvas {
  components: Record<string, JSXElementConstructor<T>>;
  edgeComponents?: Record<string, JSXElementConstructor<T>>;
  flowGraph: FlowGraph;
  nodes: Node[];
  edges: Edge[];

  constructor(props: ReactFlowCanvasProps<T>) {
    this.flowGraph = props.flowGraph;
    this.components = props.components ?? {};
    this.edgeComponents = props.edgeComponents ?? {};
    this.nodes = [];
    this.edges = [];
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      components: observable.shallow,
      flowGraph: observable.ref,
      nodes: observable.deep,
      edges: observable.deep,
      addNode: action,
      addNodes: batch,
      addEdge: action,
      addEdges: batch,
      onNodesChange: action,
      onEdgesChange: action,
      onConnect: action,
    });
  }

  protected makeNode = (nodeProps: NodeProps): Node => {
    const { type, component: componentName, data, ...node } = nodeProps;
    return {
      id: node.id,
      width: node.width,
      height: node.height,
      position: {
        x: node.x,
        y: node.y,
      },
      type: componentName,
      data,
      deletable: false,
      draggable: false,
    };
  };

  protected makeEdge = (edgeProps: EdgeProps): Edge => {
    return {
      id: uid(),
      source: edgeProps.source,
      target: edgeProps.target,
      sourceHandle: edgeProps.sourceHandle,
      targetHandle: edgeProps.targetHandle,
      label: edgeProps.label,
      type: edgeProps.type ?? (edgeProps.label ? 'fixEdge' : 'straight'),
      data: edgeProps.data,
      deletable: false,
    };
  };

  addNode(nodeProps: NodeProps) {
    this.nodes = [...this.nodes, this.makeNode(nodeProps)];
  }

  addNodes(nodes: NodeProps[]) {
    this.nodes = [...this.nodes, ...nodes.map((node) => this.makeNode(node))];
  }

  addEdge(edgeProps: EdgeProps) {
    this.edges = [...this.edges, this.makeEdge(edgeProps)];
  }

  addEdges(edgeProps: EdgeProps[]) {
    edgeProps.forEach((prop) => this.addEdge(prop));
  }

  onNodesChange(changes: NodeChange[]) {
    this.nodes = applyNodeChanges(changes, this.nodes);
  }

  onEdgesChange(changes: EdgeChange[]) {
    this.edges = applyEdgeChanges(changes, this.edges);
  }

  onConnect(connection: Connection) {
    this.edges = flowAddEdge(connection, this.edges);
  }
}
