import React, { useEffect, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Position,
  BackgroundVariant,
  ConnectionLineType,
  Edge,
} from 'reactflow'
import { observer } from '@formily/reactive-react'
import {
  ReactFlowCanvas,
  FixStepEdge,
  ForkEdge,
  FreeEdge,
  freeEdgeOptions,
  connectionLineStyle,
  LayoutModeEnum,
} from '@toy-box/flow-graph'
import { useMetaFlow, useFreeFlow } from '@toy-box/flow-node'
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
import {
  assignOnEdit,
  decideOnEdit,
  loopOnEdit,
  onPanelEdit,
  addFreeLayoutNode,
} from '../../flow-nodes'

export const FlowCanvas = observer(() => {
  const ref: any = useRef()
  const nodes = useTemplates()
  const flow = useFlow()
  const dragFlow = useDragFlow()
  const eventEngine = useEvent()
  const metaflow = useMetaFlow()
  const freeFlow = useFreeFlow()
  const style = {
    width: '100%',
    height: '800px',
    marginLeft: metaflow.flowType === 'FREE_START_UP' ? '120px' : 0,
  }
  const graphEle: any = document.querySelector('#flow-canvas')
  window.onload = function () {
    graphEle.ondragover = (e) => {
      e.dataTransfer.dropEffect = 'link'
      e.preventDefault()
    }
    graphEle.ondrop = (e) => {
      e.stopPropagation()
      const { clientX, clientY } = e
      const nodeType = e.dataTransfer.getData('text/plain')
      addFreeLayoutNode(clientX, clientY, nodeType, nodes)
    }
  }
  useEffect(() => {
    flow.flowGraph.centerX = ref?.current?.offsetWidth / 2
    dragFlow.flowGraph.centerX = ref?.current?.offsetWidth / 2
  }, [metaflow.flowType, freeFlow.flowType])
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
        component: ExtendNode,
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
  const freeFlowCanvas = new ReactFlowCanvas({
    flowGraph: dragFlow.flowGraph,
    layoutMode: LayoutModeEnum.FREE_LAYOUT,
    edgeComponents: {
      fixEdge: FixStepEdge,
      forkEdge: ForkEdge,
      freeEdge: FreeEdge,
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
        component: ExtendNode,
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
      }),
    },
  })
  useEffect(() => {
    flow.setCanvas(reactFlowCanvas)
    dragFlow.setCanvas(freeFlowCanvas)
  }, [])

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

  return (
    <div id="flow-canvas" style={style} ref={ref}>
      {(metaflow.flowType === 'AUTO_START_UP' || !metaflow.flowType) && (
        <ReactFlow
          nodes={flow.canvas?.nodes}
          edges={flow.canvas?.edges}
          onNodesChange={flow.canvas?.onNodesChange}
          onEdgesChange={flow.canvas?.onEdgesChange}
          onConnect={flow.canvas?.onConnect}
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
      )}
      {metaflow.flowType === 'FREE_START_UP' && (
        <ReactFlow
          nodes={dragFlow.canvas?.nodes}
          edges={dragFlow.canvas?.edges}
          defaultEdgeOptions={freeEdgeOptions}
          connectionLineStyle={connectionLineStyle}
          connectionLineType={ConnectionLineType.SmoothStep}
          onNodesChange={freeFlow.changeNodes}
          onEdgesChange={freeFlow.updateEdges}
          onConnect={freeFlow.addEdge}
          nodeTypes={dragFlow.canvas?.components}
          edgeTypes={dragFlow.canvas?.edgeComponents}
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
      )}
    </div>
  )
})
