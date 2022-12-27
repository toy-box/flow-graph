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
import { FlowMetaType, FreeFlow } from '@toy-box/autoflow-core'

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
  type?: string
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
      deletable: this.isFreeMode && node.id !== 'start',
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
        const nodeTarget = this.flowGraph.nodeMap[source].targets
          .map((target, index) => {
            if (target?.edgeId === change.id || target.ruleId === change.id) {
              return { ...target, index }
            }
          })
          .filter(Boolean)[0]
        this.flowGraph.nodeMap[source].targets.splice(
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
    const { target, source } = connection
    const nodeMapTargets = this.flowGraph.nodeMap[source].targets
    const casualEdge = { id: uid(), ...connection }
    const targetNode = this.nodes.find((node) => node.id === target).data.name
    switch (sourceFlowmetaNode.type) {
      case FlowMetaType.DECISION:
      case FlowMetaType.WAIT:
        const { rules, waitEvents } = this.nodes.find(
          (node) => node.id === source
        ).data
        const loadDataMap = rules ?? waitEvents
        const loadData = loadDataMap
          .map(({ name, id }) => {
            if (
              nodeMapTargets.findIndex(({ ruleId }) => id === ruleId) === -1
            ) {
              return {
                label: name,
                value: id,
                id: id,
              }
            }
          })
          .filter(Boolean)
        const isDefaultConnecter =
          sourceFlowmetaNode.defaultConnector.targetReference === ''
        if (isDefaultConnecter) {
          loadData.push({
            label: sourceFlowmetaNode.defaultConnectorName,
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
            id: uid(),
            label: loadData[0].label,
          }
          this.edges = [...this.edges, newEdge]
          if (
            loadData[0].id.split('-')[0] ===
            sourceFlowmetaNode.defaultConnectorName
          ) {
            sourceFlowmetaNode.updateConnector(target, 'defaultConnector')
          } else {
            const Index = sourceFlowmetaNode[
              rules ? 'rules' : 'waitEvents'
            ].findIndex(({ id }) => id === loadData[0].id)
            sourceFlowmetaNode.updateConnector(target, Index)
          }
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            {
              id: target,
              label: newEdge.label,
              ruleId: loadData[0].id,
              edgeId: newEdge.id,
            },
          ])
        }
        break
      case FlowMetaType.LOOP:
        const { defaultConnectorName, nextValueConnectorName } =
          sourceFlowmetaNode
        if (nodeMapTargets.length === 0) {
          loopConnectDialog(targetNode, connection, this, sourceFlowmetaNode)
        } else {
          const isDefaultConnecter =
            sourceFlowmetaNode.defaultConnector.targetReference === ''
          const newEdge = {
            ...connection,
            id: uid(),
            label: isDefaultConnecter
              ? defaultConnectorName
              : nextValueConnectorName,
          }
          isDefaultConnecter
            ? sourceFlowmetaNode.updateConnector(target, 'defaultConnector')
            : sourceFlowmetaNode.updateConnector(target, 'nextValueConnector')
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            {
              id: target,
              label: newEdge.label,
              edgeId: newEdge.id,
            },
          ])
          this.edges = [...this.edges, newEdge]
        }
        break
      case FlowMetaType.START:
      case FlowMetaType.ASSIGNMENT:
      case FlowMetaType.SORT_COLLECTION_PROCESSOR:
        sourceFlowmetaNode.updateConnector(target)
        this.flowGraph.setTarget(source, [...nodeMapTargets, { id: target }])
        this.edges = flowAddEdge(casualEdge, this.edges)
        break
      case FlowMetaType.RECORD_CREATE:
      case FlowMetaType.RECORD_LOOKUP:
      case FlowMetaType.RECORD_UPDATE:
      case FlowMetaType.RECORD_DELETE:
        if (nodeMapTargets.length === 0) {
          const newEdge = { ...connection, id: uid() }
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            { id: target, edgeId: newEdge.id },
          ])
          this.edges = [...this.edges, newEdge]
          sourceFlowmetaNode.updateConnector(target, 'connector')
        } else {
          const isFaultConnector =
            sourceFlowmetaNode.faultConnector.targetReference === ''
          const newEdge = {
            ...connection,
            id: uid(),
            label: isFaultConnector
              ? sourceFlowmetaNode.faultConnectorName
              : '',
            type: isFaultConnector ? 'faultEdge' : 'freeEdge',
          }
          isFaultConnector
            ? sourceFlowmetaNode.updateConnector(target, 'faultConnector')
            : sourceFlowmetaNode.updateConnector(target, 'connector')
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            {
              id: target,
              label: newEdge.label,
              edgeId: newEdge.id,
            },
          ])
          this.edges = [...this.edges, newEdge]
        }
        break
      default:
        this.edges = flowAddEdge(casualEdge, this.edges)
        return
    }
  }
}
