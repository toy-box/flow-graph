import {
  JSXElementConstructor,
  MemoExoticComponent,
  ComponentType,
} from 'react'
import { action, batch, define, observable } from '@formily/reactive'
import {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge as flowAddEdge,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  EdgeProps,
  NodeProps,
  HandleType,
  OnConnectStartParams,
} from 'reactflow'
import { uid } from '@toy-box/toybox-shared'
import { ICanvas } from './Canvas'
import { INode, IEdge } from '../types'
import { FlowGraph } from '../models'
import { decisonConnectDialog } from '@toy-box/flow-node'

import 'reactflow/dist/style.css'

declare type ElementType<T> =
  | JSXElementConstructor<T>
  | MemoExoticComponent<ComponentType<T>>

export interface ReactFlowCanvasProps {
  components?: Record<string, ElementType<NodeProps>>
  edgeComponents?: Record<string, ElementType<EdgeProps>>
  flowGraph: FlowGraph
}

export class ReactFlowCanvas implements ICanvas {
  components: Record<string, ElementType<NodeProps>>
  edgeComponents?: Record<string, ElementType<EdgeProps>>
  flowGraph: FlowGraph
  nodes: Node[]
  edges: Edge[]

  constructor(props: ReactFlowCanvasProps) {
    this.flowGraph = props.flowGraph
    this.components = props.components ?? {}
    this.edgeComponents = props.edgeComponents ?? {}
    this.nodes = []
    this.edges = []
    this.makeObservable()
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
    })
  }

  protected makeNode = (nodeProps: INode, flowType?: string): Node => {
    const { component: componentName, data, ...node } = nodeProps
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
      deletable: flowType === 'FREE_START_UP',
      draggable: flowType === 'FREE_START_UP',
    }
  }

  protected makeEdge = (edgeProps: IEdge): Edge => {
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
    }
  }

  setNodes(nodes: INode[], flowType?: string) {
    this.nodes = nodes.map((node) => this.makeNode(node, flowType))
    console.log('this.nodes->setNodes', this.nodes)
  }

  setEdges(edges: IEdge[]) {
    this.edges = edges.map((edge) => this.makeEdge(edge))
  }

  addNode(nodeProps: INode, flowType?: string) {
    this.nodes = [...this.nodes, this.makeNode(nodeProps, flowType)]
  }

  addNodes(nodes: INode[], flowType?: string) {
    this.nodes = [
      ...this.nodes,
      ...nodes.map((node) => this.makeNode(node, flowType)),
    ]
  }

  addEdge(edge: IEdge) {
    this.edges = [...this.edges, this.makeEdge(edge)]
    console.log('miwoyo this.edges', this.edges)
  }

  addEdges(edges: IEdge[]) {
    edges.forEach((edge) => this.addEdge(edge))
  }

  onNodesChange(changes: NodeChange[]) {
    console.log('onNodesChange---', changes)
    this.nodes = applyNodeChanges(changes, this.nodes)
  }

  onEdgesChange(changes: EdgeChange[]) {
    console.log('miwoyo onEdgesChange', changes, this.edges)
    this.edges = applyEdgeChanges(changes, this.edges)
    changes.map(({ type, id }) => {
      if (type === 'remove') {
        const [name, target, source] = id.split('-')
        const preTargetNode = this.nodes.find((node) => node.id === target)
        const targetNode = {
          ...preTargetNode,
          nextNodes: preTargetNode.nextNodes.filter((id) => id !== source),
        }
        const preSourceNode = this.nodes.find((node) => node.id === source)
        const sourceNode = {
          ...preSourceNode,
          nextNodes: preSourceNode.parents.filter((id) => id !== target),
        }
        this.nodes = [
          ...this.nodes.filter(
            (node) => node.id !== target && node.id !== source
          ),
          targetNode,
          sourceNode,
        ]
        this.onNodesChange([{ id: target, type: 'select', selected: true }])
      }
    })
  }

  onConnect(connection: Connection) {
    console.log('miwoyo onConnect', connection)
    const { type: sourceType } = this.nodes.find(
      (node) => node.id === connection.source
    )
    const targetNode = this.nodes.find((node) => node.id === connection.target)
      .data.name
    switch (sourceType) {
      case 'DecisionNode':
        const { rules } = this.nodes.find(
          (node) => node.id === connection.source
        ).data
        const loadData = rules
          .map(({ name, outcomeApi }) => {
            if (this.edges.findIndex(({ label }) => label === name) === -1) {
              return {
                label: name,
                value: name,
              }
            }
          })
          .filter(Boolean)
        if (loadData.length > 1) {
          decisonConnectDialog(targetNode, connection, this, loadData)
        } else if (loadData.length === 1) {
          const newEdge = {
            ...connection,
            label: loadData[0].label,
          }
          this.edges = flowAddEdge(newEdge, this.edges)
        }
        break
      // case 'LoopNode':
      //   break;
      default:
        this.edges = flowAddEdge(connection, this.edges)
    }
    this.nodes.map((node: Node) => {
      if (node.id === connection.source) {
        if (node.nextNodes) {
          node.nextNodes.push(connection.target)
        } else {
          node.nextNodes = [connection.target]
        }
      }
      if (node.id === connection.target) {
        if (node.parents) {
          node.parents.push(connection.source)
        } else {
          node.parents = [connection.source]
        }
      }
    })
    console.log('miwoyo onConnect', connection, this.nodes, this.edges)
  }
}
