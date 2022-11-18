import React, { useEffect, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Position,
  BackgroundVariant,
} from 'reactflow'
import { observer } from '@formily/reactive-react'
import { ReactFlowCanvas, FixStepEdge, ForkEdge } from '@toy-box/flow-graph'
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
  console.log('freeFlow', freeFlow, metaflow)
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
      console.log('e---ondrop', e, clientX, clientY)
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
    edgeComponents: {
      fixEdge: FixStepEdge,
      forkEdge: ForkEdge,
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
  useEffect(() => {
    flow.setCanvas(reactFlowCanvas)
    // console.log('flowFree', flowFree)
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
      {/* {metaflow.flowType === 'AUTO_START_UP'&&()} */}
      <ReactFlow
        nodes={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.nodes
            : dragFlow.canvas?.nodes
        }
        edges={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.edges
            : dragFlow.canvas?.edges
        }
        // nodes={flow.canvas?.nodes}
        // edges={flow.canvas?.edges}
        onNodesChange={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.onNodesChange
            : dragFlow.canvas?.onNodesChange
        }
        onEdgesChange={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.onEdgesChange
            : dragFlow.canvas?.onEdgesChange
        }
        onConnect={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.onConnect
            : dragFlow.canvas?.onConnect
        }
        nodeTypes={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.components
            : dragFlow.canvas?.components
        }
        edgeTypes={
          metaflow.flowType === 'AUTO_START_UP'
            ? flow.canvas?.edgeComponents
            : dragFlow.canvas?.edgeComponents
        }
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
  )
})
