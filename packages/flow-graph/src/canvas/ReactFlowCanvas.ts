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
import { FormDialog, FormItem, FormLayout } from '@formily/antd'
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
  data?: any
}

export interface INodesChangeProps {
  changes: NodeChange[]
  freeFlow?: FreeFlow
  isHistory?: boolean
}

export interface IEdgesChangeProps {
  changes: EdgeChange[]
  freeFlow?: FreeFlow
  isHistory?: boolean
  edges?: Edge[]
}

export interface IConnectionProps {
  connection: Connection
  sourceFlowmetaNode: any
  freeFlow?: FreeFlow
  isHistory?: boolean
  edge?: IEdge
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
    console.log(this.nodes, 'this.nodes')
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

  onNodesChange(nodesChange: INodesChangeProps) {
    if (nodesChange.freeFlow) {
      const { flowMetaNodeMap } = nodesChange.freeFlow
      nodesChange.changes.map((change) => {
        if (change.type === 'remove') {
          const {
            [change.id]: {},
            ...rest
          } = flowMetaNodeMap
          if (!nodesChange.isHistory) {
            nodesChange.freeFlow?.history.push({
              type: OpearteTypeEnum.REMOVE_NODE,
              flowNode: flowMetaNodeMap[change.id],
              updateMetaNodeMap: { ...rest },
              flowMetaNodeMap: { ...flowMetaNodeMap },
            })
          }
          nodesChange.freeFlow.getFlowMetaNodeMap(rest)
        }
      })
    }
    this.nodes = applyNodeChanges(nodesChange.changes, this.nodes)
  }

  onEdgesChange(edgesChange: IEdgesChangeProps) {
    const removeEdges = []
    const flowMetaNodeMap = { ...edgesChange.freeFlow?.flowMetaNodeMap }
    edgesChange.changes &&
      edgesChange.changes.map((change) => {
        if (change.type === 'remove') {
          const edges = this.edges
          const edge: any = edges?.find((edge) => edge.id === change.id)
          if (edge) {
            removeEdges.push(edge)
            const { source, target } = edge
            const nodeTarget = this.flowGraph?.nodeMap?.[source]?.targets
              .map((target, index) => {
                if (
                  target?.edgeId === change.id ||
                  target.ruleId === change.id
                ) {
                  return { ...target, index }
                }
              })
              .filter(Boolean)[0]
            this.flowGraph?.nodeMap[source]?.targets.splice(
              nodeTarget ? nodeTarget.index : 0,
              1
            )
            edgesChange.freeFlow?.flowMetaNodeMap[source]?.deleteConnector(
              target,
              nodeTarget
            )
            // this.onNodesChange({
            //   changes: [{ id: source, type: 'select', selected: true }],
            // })
          }
        }
      })
    const hasRemoveChanges =
      edgesChange.changes &&
      edgesChange.changes.filter((change) => change.type === 'remove')
    if (
      hasRemoveChanges &&
      hasRemoveChanges.length > 0 &&
      !edgesChange.isHistory
    ) {
      const selectNode = this.nodes?.find((node) => node.selected)
      edgesChange.freeFlow?.history?.push({
        type: OpearteTypeEnum.REMOVE_EDGE,
        edges: removeEdges,
        nodeId: selectNode?.id,
        updateMetaNodeMap: { ...edgesChange.freeFlow.flowMetaNodeMap },
        flowMetaNodeMap,
      })
    }
    this.edges = applyEdgeChanges(edgesChange.changes, this.edges)
  }

  onConnect(connecObj: IConnectionProps) {
    const { target, source } = connecObj.connection
    const nodeMapTargets = this.flowGraph.nodeMap[source].targets
    let edgeId = connecObj?.edge?.id ?? uid()
    let newEdge: IEdge = { ...connecObj.connection }
    const targetNode = this.nodes.find((node) => node.id === target).data.name
    const flowMetaNodeMap = { ...connecObj.freeFlow.flowMetaNodeMap }
    switch (connecObj.sourceFlowmetaNode.type) {
      case FlowMetaType.DECISION:
      case FlowMetaType.WAIT:
        const { rules, waitEvents } = connecObj.sourceFlowmetaNode
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
          connecObj.sourceFlowmetaNode.defaultConnector.targetReference === ''
        if (isDefaultConnecter) {
          loadData.push({
            label: connecObj.sourceFlowmetaNode.defaultConnectorName,
            value: uid(),
            id: uid(),
          })
        }
        if (loadData.length > 1) {
          if (connecObj.isHistory) {
            newEdge = {
              ...connecObj.connection,
              label: connecObj.edge?.label as any,
            }
            this.addEdge(newEdge, connecObj.edge.id)
            connecObj.sourceFlowmetaNode.updateConnector(
              target,
              'defaultConnector'
            )
            this.flowGraph.setTarget(source, [
              ...this.flowGraph.nodeMap[source].targets,
              {
                id: target,
                label: newEdge.label,
                edgeId: newEdge.id,
                ruleId: null,
              },
            ])
          } else {
            connecObj.sourceFlowmetaNode.connectDialog(
              targetNode,
              connecObj.connection,
              this,
              connecObj.freeFlow,
              loadData,
              connecObj.sourceFlowmetaNode
            )
          }
        } else if (loadData.length === 1) {
          newEdge = {
            ...connecObj.connection,
            label: loadData[0].label,
          }
          edgeId = connecObj?.edge?.id ?? uid()
          this.addEdge(newEdge, edgeId)
          if (!loadData[0].ruleId) {
            connecObj.sourceFlowmetaNode.updateConnector(
              target,
              'defaultConnector'
            )
          } else {
            const Index = connecObj.sourceFlowmetaNode[
              rules ? 'rules' : 'waitEvents'
            ].findIndex(({ id }) => id === loadData[0].id)
            connecObj.sourceFlowmetaNode.updateConnector(target, Index)
          }
          if (!connecObj.isHistory) {
            connecObj.freeFlow?.history?.push({
              type: OpearteTypeEnum.ADD_EDGE,
              edges: [
                {
                  ...newEdge,
                  id: edgeId,
                },
              ],
              updateMetaNodeMap: { ...connecObj.freeFlow.flowMetaNodeMap },
              flowMetaNodeMap,
            })
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
          connecObj.sourceFlowmetaNode
        if (nodeMapTargets.length === 0) {
          if (connecObj.isHistory) {
            newEdge = {
              ...connecObj.connection,
              label: connecObj.edge?.label as any,
            }
            this.addEdge(newEdge, connecObj.edge.id)
          } else {
            connecObj.sourceFlowmetaNode.connectDialog(
              targetNode,
              connecObj.connection,
              this,
              connecObj.freeFlow,
              connecObj.sourceFlowmetaNode
            )
          }
        } else {
          const isDefaultConnecter =
            connecObj.sourceFlowmetaNode.defaultConnector.targetReference == ''
          newEdge = {
            ...connecObj.connection,
            label: isDefaultConnecter
              ? defaultConnectorName
              : nextValueConnectorName,
          }
          edgeId = connecObj?.edge?.id ?? uid()
          this.addEdge(newEdge, edgeId)
          connecObj.sourceFlowmetaNode.updateConnector(
            target,
            isDefaultConnecter
          )
          if (!connecObj.isHistory) {
            connecObj.freeFlow?.history?.push({
              type: OpearteTypeEnum.ADD_EDGE,
              edges: [
                {
                  ...newEdge,
                  id: edgeId,
                },
              ],
              updateMetaNodeMap: { ...connecObj.freeFlow.flowMetaNodeMap },
              flowMetaNodeMap,
            })
          }
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
          edgeId = connecObj?.edge?.id ?? uid()
          this.flowGraph.setTarget(source, [
            ...nodeMapTargets,
            { id: target, edgeId },
          ])
          connecObj.sourceFlowmetaNode.updateConnector(target)
        } else {
          const isFaultConnector =
            connecObj.sourceFlowmetaNode.faultConnector.targetReference == ''
          newEdge = {
            ...connecObj.connection,
            label: isFaultConnector
              ? connecObj.sourceFlowmetaNode.faultConnectorName
              : '',
            type: isFaultConnector
              ? EdgeTypeEnum.FAULT_EDGE
              : EdgeTypeEnum.FREE_EDGE,
          }
          edgeId = connecObj?.edge?.id ?? uid()
          connecObj.sourceFlowmetaNode.updateConnector(target, isFaultConnector)
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
        if (!connecObj.isHistory) {
          connecObj.freeFlow?.history?.push({
            type: OpearteTypeEnum.ADD_EDGE,
            edges: [
              {
                ...newEdge,
                id: edgeId,
              },
            ],
            updateMetaNodeMap: { ...connecObj.freeFlow.flowMetaNodeMap },
            flowMetaNodeMap,
          })
        }
        break
    }
  }
}
