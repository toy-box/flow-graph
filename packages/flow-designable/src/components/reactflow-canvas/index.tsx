import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Position,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
  Node,
  NodeChange,
} from 'reactflow'
import { observer } from '@formily/reactive-react'
import {
  ReactFlowCanvas,
  FixStepEdge,
  ForkEdge,
  FreeEdge,
  FaultEdge,
  freeEdgeOptions,
  connectionLineStyle,
  LayoutModeEnum,
  FlowModeEnum,
} from '@toy-box/flow-graph'
import { FreeFlow, MetaFlow } from '@toy-box/autoflow-core'
import {
  connectReactFlow,
  connectFreeFlow,
  ExtendNode,
  StandardNode,
  ExtendPanel,
  useFlow,
  useDragFlow,
  useTemplates,
  useEvent,
} from '@toy-box/flow-node'
import { isArr } from '@designable/shared'
import {
  assignOnEdit,
  decideOnEdit,
  loopOnEdit,
  onPanelEdit,
  addFreeLayoutNode,
  decisonConnectDialog,
  loopConnectDialog,
  deleteDialog,
} from '../../nodes'
import { useDesigner, useService } from '../../hooks'

export const FlowCanvas: FC<any> = observer(() => {
  const ref: any = useRef()
  const nodes = useTemplates()
  const flow = useFlow()
  const dragFlow = useDragFlow()
  const eventEngine = useEvent()
  const designer = useDesigner()
  const { getMetaObjectData, getShortCuts } = useService()
  const freeFlow = designer.metaFlow as FreeFlow
  const metaflow = designer.metaFlow as MetaFlow
  useEffect(() => {
    getMetaObjectData().then(({ data }) => {
      if (isArr(data)) designer.metaFlow.initRegisters(data)
    })
    if (getShortCuts) {
      getShortCuts().then(({ data }) => {
        if (isArr(data)) designer.metaFlow.initShortCuts(data)
      })
    }
  }, [designer.metaFlow.initRegisters])
  const style = {
    width: '100%',
    height: '100%',
    // marginLeft:
    //   metaflow.layoutMode === LayoutModeEnum.FREE_LAYOUT ? '300px' : 0,
  }

  useEffect(() => {
    const graphEle: any = document.querySelector('#flow-canvas')
    graphEle.ondragover = (e) => {
      e.dataTransfer.dropEffect = 'link'
      e.preventDefault()
    }
    graphEle.ondrop = (e) => {
      e.stopPropagation()
      const { clientX, clientY } = e
      const { key, id } = JSON.parse(e.dataTransfer.getData('text/plain'))
      console.log('nodeType', key, id)
      addFreeLayoutNode(clientX, clientY, key, nodes, id)
    }
  }, [designer?.layoutMode, freeFlow])
  useEffect(() => {
    if (designer?.layoutMode === LayoutModeEnum.AUTO_LAYOUT) {
      flow.flowGraph.centerX = ref?.current?.offsetWidth / 2
      const reactFlowCanvas = new ReactFlowCanvas({
        flowGraph: flow.flowGraph,
        edgeComponents: {
          fixEdge: FixStepEdge,
          forkEdge: ForkEdge,
        },
        components: {
          StartNode: connectReactFlow({
            component: StandardNode,
            content: <h3>Start</h3>,
            handles: [{ type: 'source', position: Position.Bottom }],
          }),
          EndNode: connectReactFlow({
            component: StandardNode,
            content: <h3>End</h3>,
            handles: [{ type: 'target', position: Position.Top }],
          }),
          ExtendNode: connectReactFlow({
            component: ExtendNode as any,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            content: <ExtendPanel />,
            onEdit: onPanelEdit,
          }),
          DecisionNode: connectReactFlow({
            component: StandardNode,
            content: <h3>Decision</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            onEdit: decideOnEdit,
          }),
          AssignmentNode: connectReactFlow({
            component: StandardNode,
            content: <h3>assign</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            onEdit: assignOnEdit,
          }),
          ActionNode: connectReactFlow({
            component: StandardNode,
            content: <h3>action</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          LoopNode: connectReactFlow({
            component: StandardNode,
            content: <h3>Loop</h3>,
            handles: [
              { type: 'target', position: Position.Top, id: Position.Top },
              {
                type: 'source',
                position: Position.Bottom,
                id: Position.Bottom,
              },
              { type: 'target', position: Position.Left, id: Position.Left },
              { type: 'source', position: Position.Right, id: Position.Right },
            ],
            onEdit: loopOnEdit,
          }),
        },
      })
      flow.setCanvas(reactFlowCanvas)
    } else {
      dragFlow.flowGraph.centerX = ref?.current?.offsetWidth / 2
      const freeFlowCanvas = new ReactFlowCanvas({
        flowGraph: dragFlow.flowGraph,
        layoutMode: LayoutModeEnum.FREE_LAYOUT,
        mode: freeFlow.mode,
        edgeComponents: {
          fixEdge: FixStepEdge,
          forkEdge: ForkEdge,
          freeEdge: FreeEdge,
          faultEdge: FaultEdge,
        },
        components: {
          StartNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Start</h3>,
            handles: [{ type: 'source', position: Position.Bottom }],
          }),
          EndNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>End</h3>,
            handles: [{ type: 'target', position: Position.Top }],
          }),
          ExtendNode: connectFreeFlow({
            component: ExtendNode as any,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            content: <ExtendPanel />,
            onEdit: onPanelEdit,
          }),
          DecisionNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Decision</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            onEdit: decideOnEdit,
            connectDialog: decisonConnectDialog,
          }),
          AssignmentNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>assign</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            onEdit: assignOnEdit,
          }),
          ActionNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>action</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          LoopNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Loop</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            onEdit: loopOnEdit,
            connectDialog: loopConnectDialog,
          }),
          WaitNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Pause</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            connectDialog: decisonConnectDialog,
          }),
          SortCollectionNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Sort</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          RecordCreateNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Create</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          RecordUpdateNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Update</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          RecordDeleteNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>Delete</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          RecordLookupNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>LookUp</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          HttpCallsNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>action</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          ShortcutNode: connectFreeFlow({
            component: StandardNode,
            content: <h3>shortcut</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
        },
      })
      dragFlow.setCanvas(freeFlowCanvas)
    }
  }, [designer?.layoutMode, freeFlow])

  const dispatchClickPane = React.useCallback(
    (data) => {
      eventEngine.dispatch({
        type: 'clickPane',
        data,
      })
    },
    [eventEngine]
  )

  const dispatchClickNode = React.useCallback(
    (event, data) => {
      eventEngine.dispatch({
        type: 'clickNode',
        data,
      })
    },
    [eventEngine]
  )

  const dispatchClickEdge = React.useCallback(
    (event, data) => {
      const new_edges: any[] =
        dragFlow &&
        dragFlow.canvas.edges.map((edge: Edge) => {
          if (edge.id === data.id) {
            edge.zIndex = 1
          } else {
            edge.zIndex = 0
          }

          return edge
        })

      dragFlow.canvas.edges = new_edges
      eventEngine.dispatch({
        type: 'clickEdge',
        data,
      })
    },
    [eventEngine]
  )

  const dispatchMoveStart = React.useCallback(
    (event, data) => {
      eventEngine.dispatch({
        type: 'moveStart',
        data,
      })
    },
    [eventEngine]
  )

  const doubleClickNode = (event: React.MouseEvent, node: Node) => {
    onPanelEdit(freeFlow.flowMetaNodeMap[node.id], node.id)
  }

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const deleteNodeList = changes.filter((item) => item.type === 'remove')
    if (deleteNodeList.length) {
      const dialog = deleteDialog()
      dialog
        .forOpen((payload, next) => {
          setTimeout(() => {
            next({})
          }, 500)
        })
        .forConfirm((payload, next) => {
          freeFlow.changeNodes(changes)
          next(payload)
        })
        .forCancel((payload, next) => {
          next(payload)
        })
        .open()
    } else {
      freeFlow.changeNodes(changes)
    }
  }, [])

  const onEdgesChange = (changes: any) => {
    const selectNode = dragFlow.canvas?.nodes?.find((node) => node.selected)
    if (!selectNode) {
      freeFlow.updateEdges(changes)
    }
  }
  const isEditMode = freeFlow.mode === FlowModeEnum.EDIT

  return (
    <>
      {designer.layoutMode === LayoutModeEnum.FREE_LAYOUT ? (
        <div id="flow-canvas" style={style} ref={ref}>
          <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <marker
                id="myArrowClosed"
                orient="auto"
                viewBox="0 0 60 60"
                markerHeight={20}
                markerWidth={20}
                refX={9}
                refY={10}
              >
                <path
                  d="M0 0 L10 10 L0 20 z"
                  fill="rgb(145, 146, 151)"
                  strokeWidth="2"
                ></path>
              </marker>
            </defs>
          </svg>
          <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <marker
                id="freeHoverArrow"
                orient="auto"
                viewBox="0 0 60 60"
                markerHeight={2}
                markerWidth={2}
                refX={9}
                refY={10}
              >
                <path
                  d="M0 0 L10 10 L0 20 z"
                  fill="rgb(21, 137, 238)"
                  strokeWidth="2"
                ></path>
              </marker>
            </defs>
          </svg>
          <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <marker
                id="freeSelectedArrow"
                orient="auto"
                viewBox="0 0 60 60"
                markerHeight={2.2}
                markerWidth={2.2}
                refX={9}
                refY={10}
              >
                <path
                  d="M0 0 L10 10 L0 20 z"
                  fill="rgb(0, 112, 210)"
                  strokeWidth="2"
                ></path>
              </marker>
            </defs>
          </svg>
          <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <marker
                id="faultClosedArrow"
                orient="auto"
                viewBox="0 0 60 60"
                markerHeight={2}
                markerWidth={2}
                refX={9}
                refY={10}
              >
                <path
                  d="M0 0 L10 10 L0 20 z"
                  fill="rgb(194, 57, 52)"
                  strokeWidth="2"
                ></path>
              </marker>
            </defs>
          </svg>
          <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <marker
                id="faultHoverArrow"
                orient="auto"
                viewBox="0 0 60 60"
                markerHeight={2}
                markerWidth={2}
                refX={9}
                refY={10}
              >
                <path
                  d="M0 0 L10 10 L0 20 z"
                  fill="rgb(142, 3, 15)"
                  strokeWidth="2"
                ></path>
              </marker>
            </defs>
          </svg>
          <svg style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <marker
                id="faultSelectedArrow"
                orient="auto"
                viewBox="0 0 60 60"
                markerHeight={2.2}
                markerWidth={2.2}
                refX={9}
                refY={10}
              >
                <path
                  d="M0 0 L10 10 L0 20 z"
                  fill="rgb(142, 3, 15)"
                  strokeWidth="2"
                ></path>
              </marker>
            </defs>
          </svg>
          <ReactFlow
            nodes={dragFlow.canvas?.nodes}
            edges={dragFlow.canvas?.edges}
            defaultEdgeOptions={freeEdgeOptions}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={ConnectionLineType.SmoothStep}
            onNodesChange={(changes) => isEditMode && onNodesChange(changes)}
            onNodeDoubleClick={isEditMode && doubleClickNode}
            onEdgesChange={(changes) => isEditMode && onEdgesChange(changes)}
            // onNodesChange={freeFlow.changeNodes}
            // onNodeDoubleClick={doubleClickNode}
            // onEdgesChange={freeFlow.updateEdges}
            onConnect={freeFlow.addEdge}
            nodeTypes={dragFlow.canvas?.components}
            edgeTypes={dragFlow.canvas?.edgeComponents}
            onPaneClick={dispatchClickPane}
            onNodeClick={dispatchClickNode}
            onEdgeClick={dispatchClickEdge}
            onMoveStart={dispatchMoveStart}
            zoomOnDoubleClick={isEditMode}
            proOptions={{ hideAttribution: true }}
            zoomOnScroll={false}
          >
            <Background gap={30} variant={BackgroundVariant.Cross} />
            <Controls />
          </ReactFlow>
        </div>
      ) : (
        <div id="flow-canvas" style={style} ref={ref}>
          <ReactFlow
            nodes={flow.canvas?.nodes}
            edges={flow.canvas?.edges}
            onNodesChange={() => flow.canvas?.onNodesChange}
            onEdgesChange={() => flow.canvas?.onEdgesChange}
            onConnect={() => flow.canvas?.onConnect}
            nodeTypes={flow.canvas?.components}
            edgeTypes={flow.canvas?.edgeComponents}
            onPaneClick={dispatchClickPane}
            onNodeClick={dispatchClickNode}
            onEdgeClick={dispatchClickEdge}
            onMoveStart={dispatchMoveStart}
            proOptions={{ hideAttribution: true }}
            zoomOnScroll={false}
          >
            <Background gap={30} variant={BackgroundVariant.Cross} />
            <Controls />
          </ReactFlow>
        </div>
      )}
    </>
  )
})
