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
} from 'reactflow'
import { uid } from '@toy-box/toybox-shared'
import { ICanvas } from './Canvas'
import { INode, IEdge, LayoutModeEnum } from '../types'
import { FlowGraph } from '../models'
import { decisonConnectDialog, loopConnectDialog } from '@toy-box/flow-node'
import { FlowMetaType } from '@toy-box/autoflow-core'

import 'reactflow/dist/style.css'
import './canvas.less'

declare type ElementType<T> =
  | JSXElementConstructor<T>
  | MemoExoticComponent<ComponentType<T>>

export interface ReactFlowCanvasProps {
  components?: Record<string, ElementType<NodeProps>>
  edgeComponents?: Record<string, ElementType<EdgeProps>>
  layoutMode?: LayoutModeEnum
  flowGraph: FlowGraph
}
declare type templateSource = {
  nextNodes?: string[]
}

export class ReactFlowCanvas implements ICanvas {
  components: Record<string, ElementType<NodeProps>>
  edgeComponents?: Record<string, ElementType<EdgeProps>>
  flowGraph: FlowGraph
  nodes: (Node & templateSource)[]
  edges: Edge[]
  layoutMode?: LayoutModeEnum

  constructor(props: ReactFlowCanvasProps) {
    this.flowGraph = props.flowGraph
    this.components = props.components ?? {}
    this.edgeComponents = props.edgeComponents ?? {}
    this.nodes = []
    this.edges = []
    this.layoutMode = props.layoutMode || LayoutModeEnum.FREE_LAYOUT
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

  get isFreeMode() {
    return this.layoutMode === LayoutModeEnum.FREE_LAYOUT
  }

  protected makeNode = (nodeProps: INode): Node => {
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
      deletable: this.isFreeMode,
      draggable: this.isFreeMode,
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

  setNodes(nodes: INode[]) {
    this.nodes = nodes.map((node) => this.makeNode(node))
    console.log('this.nodes->setNodes', this.nodes)
  }

  setEdges(edges: IEdge[]) {
    this.edges = edges.map((edge) => this.makeEdge(edge))
  }

  addNode(nodeProps: INode) {
    this.nodes = [...this.nodes, this.makeNode(nodeProps)]
  }

  addNodes(nodes: INode[]) {
    this.nodes = [...this.nodes, ...nodes.map((node) => this.makeNode(node))]
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

  onEdgesChange(changes: EdgeChange[], flowMetaNodeMap?: any) {
    console.log('miwoyo onEdgesChange', changes, this.edges)
    this.edges = applyEdgeChanges(changes, this.edges)
    changes.map((change) => {
      if (change.type === 'remove') {
        const [, source, target] = change.id.split('-')
        const preSourceNode = this.nodes.find((node) => node.id === source)
        const sourceNode = {
          ...preSourceNode,
          nextNodes: preSourceNode.nextNodes.filter((id) => id !== target),
        }
        this.nodes = [
          ...this.nodes.filter((node) => node.id !== source),
          sourceNode,
        ]
        flowMetaNodeMap[source].deleteConnector(target)
        this.onNodesChange([{ id: source, type: 'select', selected: true }])
      }
    })
  }

  onConnect(connection: Connection, sourceFlowmetaNode?: any) {
    console.log('miwoyo onConnect', connection)
    const newEdgeId =
      'reactflow__edge' + uid() + `-${connection.source}-${connection.target}`
    const sourceNode = this.nodes.find((node) => node.id === connection.source)
    const targetNode = this.nodes.find((node) => node.id === connection.target)
      .data.name
    switch (sourceFlowmetaNode.type) {
      case FlowMetaType.DECISION:
        const { rules } = this.nodes.find(
          (node) => node.id === connection.source
        ).data
        const loadData = rules
          .map(({ name }) => {
            console.log('label,name', this.edges, name)
            if (
              this.edges.findIndex(
                ({ id, label }) =>
                  id.split('-')[1] === connection.source && label === name
              ) === -1
            ) {
              return {
                label: name,
                value: name,
              }
            }
          })
          .filter(Boolean)
        const isDefaultConnecter =
          sourceFlowmetaNode.defaultConnector.targetReference === ''
        if (isDefaultConnecter) {
          loadData.push({
            label: 'default',
            value: 'default',
          })
        }
        if (loadData.length > 1) {
          decisonConnectDialog(
            targetNode,
            connection,
            this,
            loadData,
            sourceFlowmetaNode
          )
        } else if (loadData.length === 1) {
          const newEdge = {
            ...connection,
            label: loadData[0].label,
          }
          this.edges = flowAddEdge(newEdge, this.edges)
        }
        break
      case FlowMetaType.LOOP:
        const isDialog =
          sourceFlowmetaNode.defaultConnector.targetReference === '' &&
          sourceFlowmetaNode.nextValueConnector.targetReference === ''
        if (isDialog) {
          loopConnectDialog(targetNode, connection, this, sourceFlowmetaNode)
        } else {
          const isDefaultConnecter =
            sourceFlowmetaNode.defaultConnector.targetReference === ''
          const newEdge = {
            ...connection,
            id: newEdgeId,
            label: isDefaultConnecter ? 'For Each Item' : 'After Last Item',
          }
          isDefaultConnecter
            ? sourceFlowmetaNode.updateConnector(
                connection.target,
                'defaultConnector'
              )
            : sourceFlowmetaNode.updateConnector(
                connection.target,
                'nextValueConnector'
              )
          // this.edges = flowAddEdge(newEdge, this.edges)
          this.edges = [...this.edges, newEdge]
        }
        break
      case FlowMetaType.ASSIGNMENT:
        console.log('sourceNode', sourceNode)
        sourceFlowmetaNode.updateConnector(connection.target)
        this.edges = flowAddEdge(connection, this.edges)
      default:
        return
    }
    this.nodes.map((node) => {
      if (node.id === connection.source) {
        if (node.nextNodes) {
          node.nextNodes.push(connection.target)
        } else {
          node.nextNodes = [connection.target]
        }
      }
      // if (node.id === connection.target) {
      //   if (node.parents) {
      //     node.parents.push(connection.source)
      //   } else {
      //     node.parents = [connection.source]
      //   }
      // }
    })
    console.log('miwoyo onConnect', connection, this.nodes, this.edges)
  }
}
