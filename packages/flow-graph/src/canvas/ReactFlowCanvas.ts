import {
  JSXElementConstructor,
  MemoExoticComponent,
  ComponentType,
} from 'react'
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
import { action, batch, define, observable } from '@formily/reactive'
import { FlowMetaType, FreeFlow, OpearteTypeEnum } from '@toy-box/autoflow-core'
import { uid } from '@toy-box/toybox-shared'
import { ICanvas } from './Canvas'
import { INode, IEdge, LayoutModeEnum, EdgeTypeEnum } from '../types'
import { FlowGraph } from '../models'

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

  removeEdges(changes: EdgeChange[]) {
    this.edges = applyEdgeChanges(changes, this.edges)
  }

  onNodesChange(changes: NodeChange[], freeFlow?: FreeFlow) {
    if (freeFlow) {
      const { flowMetaNodeMap } = freeFlow
      changes.map((change) => {
        if (change.type === 'remove') {
          const {
            [change.id]: {},
            ...rest
          } = flowMetaNodeMap
          freeFlow.getFlowMetaNodeMap(rest)
          freeFlow?.history.push({
            type: OpearteTypeEnum.REMOVE_NODE,
            nodeChange: {
              id: change.id,
              type: 'remove',
            },
            flowMetaNodeMap: rest,
          })
        }
      })
    }
    this.nodes = applyNodeChanges(changes, this.nodes)
  }

  onEdgesChange(changes: EdgeChange[], freeFlow?: FreeFlow) {
    changes.map((change) => {
      if (change.type === 'remove') {
        const edge: any = this.edges.find((edge) => edge.id === change.id)
        const { source, target } = edge
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
        freeFlow.flowMetaNodeMap[source].deleteConnector(target, nodeTarget)
        freeFlow?.history?.push({
          type: OpearteTypeEnum.REMOVE_Edge,
          edge,
          flowMetaNodeMap: freeFlow.flowMetaNodeMap,
        })
        this.onNodesChange([{ id: source, type: 'select', selected: true }])
      }
    })
    this.edges = applyEdgeChanges(changes, this.edges)
  }

  onConnect(connection: Connection, sourceFlowmetaNode?: any) {
    const { target, source } = connection
    const nodeMapTargets = this.flowGraph.nodeMap[source].targets
    let edgeId = uid()
    let newEdge: IEdge = { ...connection }
    const targetNode = this.nodes.find((node) => node.id === target).data.name
    switch (sourceFlowmetaNode.type) {
      case FlowMetaType.DECISION:
      case FlowMetaType.WAIT:
        const { rules, waitEvents } = sourceFlowmetaNode
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
                ruleId: id,
              }
            }
          })
          .filter(Boolean)
        const isDefaultConnecter =
          sourceFlowmetaNode.defaultConnector.targetReference === ''
        if (isDefaultConnecter) {
          loadData.push({
            label: sourceFlowmetaNode.defaultConnectorName,
            value: uid(),
            id: uid(),
          })
        }
        if (loadData.length > 1) {
          sourceFlowmetaNode.connectDialog(
            targetNode,
            connection,
            this,
            loadData,
            sourceFlowmetaNode
          )
        } else if (loadData.length === 1) {
          newEdge = {
            ...connection,
            label: loadData[0].label,
          }
          edgeId = uid()
          this.addEdge(newEdge, edgeId)
          if (!loadData[0].ruleId) {
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
              edgeId,
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
            sourceFlowmetaNode.defaultConnector.targetReference == ''
          newEdge = {
            ...connection,
            label: isDefaultConnecter
              ? defaultConnectorName
              : nextValueConnectorName,
          }
          edgeId = uid()
          this.addEdge(newEdge, edgeId)
          sourceFlowmetaNode.updateConnector(target, isDefaultConnecter)
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            {
              id: target,
              label: newEdge.label,
              edgeId,
            },
          ])
        }
        break
      default:
        if (nodeMapTargets.length === 0) {
          edgeId = uid()
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            { id: target, edgeId },
          ])
          sourceFlowmetaNode.updateConnector(target)
        } else {
          const isFaultConnector =
            sourceFlowmetaNode.faultConnector.targetReference == ''
          newEdge = {
            ...connection,
            label: isFaultConnector
              ? sourceFlowmetaNode.faultConnectorName
              : '',
            type: isFaultConnector
              ? EdgeTypeEnum.FAULT_EDGE
              : EdgeTypeEnum.FREE_EDGE,
          }
          edgeId = uid()
          sourceFlowmetaNode.updateConnector(target, isFaultConnector)
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            {
              id: target,
              label: newEdge.label,
              edgeId,
            },
          ])
        }
        this.addEdge(newEdge, edgeId)
        break
    }
  }
}
