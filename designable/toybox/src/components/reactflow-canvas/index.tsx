import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Position,
  BackgroundVariant,
} from 'reactflow';
import { observer } from '@formily/reactive-react';
import {
  ReactFlowCanvas,
  connectReactFlow,
  ExtendNode,
  StandardNode,
  FixStepEdge,
  ForkEdge,
  ExtendPanel,
  useFlow,
  useEvent,
} from '@toy-box/flow-graph';

export const FlowCanvas = observer(() => {
  const flow = useFlow();
  const eventEngine = useEvent();
  const style = {
    width: '100%',
    height: '800px',
  };

  useEffect(() => {
    flow.setCanvas(
      new ReactFlowCanvas({
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
            onClick: (id: string, data: any) => {
              console.log('node click', id, data.title);
            },
          }),
          EndNode: connectReactFlow({
            component: StandardNode,
            content: <h3>End</h3>,
            handles: [{ type: 'target', position: Position.Top }],
            onClick: (id: string, data: any) => {
              console.log('node click', id, data.title);
            },
          }),
          ExtendNode: connectReactFlow({
            component: ExtendNode,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
            content: <ExtendPanel />,
          }),
          DecisionNode: connectReactFlow({
            component: StandardNode,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
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
          }),
        },
      })
    );
  }, []);

  const dispatchClickPane = React.useCallback(
    (data) => {
      eventEngine.dispatch({
        type: 'clickPane',
        data,
      });
    },
    [eventEngine]
  );

  const dispatchClickNode = React.useCallback(
    (event, data) => {
      eventEngine.dispatch({
        type: 'clickNode',
        data,
      });
    },
    [eventEngine]
  );

  const dispatchClickEdge = React.useCallback(
    (event, data) => {
      eventEngine.dispatch({
        type: 'clickEdge',
        data,
      });
    },
    [eventEngine]
  );

  return (
    <div id="flow-canvas" style={style}>
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
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={false}
      >
        <Background gap={30} variant={BackgroundVariant.Cross} />
        <Controls />
      </ReactFlow>
    </div>
  );
});
