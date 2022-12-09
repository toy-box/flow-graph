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

export interface IConnectionWithLabel extends Connection {
  label?: string
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

  protected makeEdge = (edgeProps: IEdge, edgeId?: string): Edge => {
    return {
      id: edgeId || uid(),
      source: edgeProps.source,
      target: edgeProps.target,
      sourceHandle: edgeProps.sourceHandle,
      targetHandle: edgeProps.targetHandle,
      label: edgeProps.label,
      type: edgeProps.type ?? (edgeProps.label ? 'fixEdge' : 'straight'),
      data: edgeProps.data,
      // deletable: false,
      deletable: this.isFreeMode,
    }
  }

  setNodes(nodes: INode[]) {
    this.nodes = nodes.map((node) => this.makeNode(node))
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

  addEdge(edge: IEdge, edgeId?: string) {
    this.edges = [...this.edges, this.makeEdge(edge, edgeId)]
  }

  addEdges(edges: IEdge[]) {
    edges.forEach((edge) => this.addEdge(edge))
  }

  onNodesChange(changes: NodeChange[]) {
    this.nodes = applyNodeChanges(changes, this.nodes)
  }

  onEdgesChange(changes: EdgeChange[], flowMetaNodeMap?: any) {
    changes.map((change) => {
      if (change.type === 'remove') {
        const { source, target } = this.edges.find(
          (edge) => edge.id === change.id
        )
        const nodeTarget = flowMetaNodeMap[source].flowNode.targets
          .map((target, index) => {
            if (target?.edgeId === change.id || target.ruleId === change.id) {
              return { ...target, index }
            }
          })
          .filter(Boolean)[0]
        flowMetaNodeMap[source].flowNode.targets.splice(
          nodeTarget ? nodeTarget.index : 0,
          1
        )
        flowMetaNodeMap[source].deleteConnector(target, nodeTarget)
        this.onNodesChange([{ id: source, type: 'select', selected: true }])
      }
    })
    this.edges = applyEdgeChanges(changes, this.edges)
  }

  onConnect(connection: Connection, sourceFlowmetaNode?: any) {
    const casualEdge = { id: uid(), ...connection }
    const sourceNode = this.nodes.find((node) => node.id === connection.source)
    const targetNode = this.nodes.find((node) => node.id === connection.target)
      .data.name
    switch (sourceFlowmetaNode.type) {
      case FlowMetaType.DECISION:
        const { rules } = this.nodes.find(
          (node) => node.id === connection.source
        ).data
        const loadData = rules
          .map(({ name, id: ruleId }) => {
            if (
              this.edges.findIndex(
                ({ source, id }) =>
                  source === connection.source && id === ruleId
              ) === -1
            ) {
              return {
                label: name,
                value: ruleId,
                id: ruleId,
              }
            }
          })
          .filter(Boolean)
        const isDefaultConnecter =
          sourceFlowmetaNode.defaultConnector.targetReference === ''
        if (isDefaultConnecter) {
          loadData.push({
            label: 'default',
            value: 'default' + '-' + uid(),
            id: 'default' + '-' + uid(),
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
            id: loadData[0].id ?? uid(),
            label: loadData[0].label,
          }
          // this.edges = flowAddEdge(newEdge, this.edges)
          this.edges = [...this.edges, newEdge]
          if (loadData[0].id.split('-')[0] === 'default') {
            sourceFlowmetaNode.updateConnector(
              connection.target,
              'defaultConnector'
            )
          } else {
            const Index = sourceFlowmetaNode.rules.findIndex(
              ({ id }) => id === loadData[0].id
            )
            sourceFlowmetaNode.updateConnector(connection.target, Index)
          }
          sourceFlowmetaNode.flowNode.targets.push({
            id: connection.target,
            label: newEdge.label,
            ruleId: loadData[0].id ?? null,
            edgeId: uid(),
          })
        }
        break
      case FlowMetaType.LOOP:
        const isDialog =
          sourceFlowmetaNode.defaultConnector.targetReference === '' &&
          sourceFlowmetaNode.nextValueConnector.targetReference === ''
        // debugger
        if (isDialog) {
          loopConnectDialog(targetNode, connection, this, sourceFlowmetaNode)
        } else {
          const isDefaultConnecter =
            sourceFlowmetaNode.defaultConnector.targetReference === ''
          const newEdge = {
            ...connection,
            id: uid(),
            label: isDefaultConnecter ? 'After Last Item' : 'For Each Item',
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
          sourceFlowmetaNode.flowNode.targets.push({
            id: connection.target,
            label: newEdge.label,
            edgeId: newEdge.id,
          })
          this.edges = [...this.edges, newEdge]
        }
        break
      case FlowMetaType.ASSIGNMENT:
        sourceFlowmetaNode.updateConnector(connection.target)
        sourceFlowmetaNode.flowNode.targets.push({ id: connection.target })
        this.edges = flowAddEdge(casualEdge, this.edges)
        break
      case FlowMetaType.START:
        sourceFlowmetaNode.updateConnector(connection.target)
        sourceFlowmetaNode.flowNode.targets.push({ id: connection.target })
        this.edges = flowAddEdge(casualEdge, this.edges)
        break
      default:
        this.edges = flowAddEdge(casualEdge, this.edges)
        return
    }
  }
}
