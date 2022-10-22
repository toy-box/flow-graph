import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Position } from 'reactflow';
import { observer } from '@formily/reactive-react';
import { ReactFlowCanvas } from '@toy-box/flow-graph';
import {
  connectReactFlow,
  ExtendNode,
  FlowNode,
  FixStepEdge,
  ForkEdge,
} from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';

export const FlowCanvas = observer(() => {
  const flow = useFlow() as any;
  const style = {
    width: '1240px',
    height: '960px',
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
            component: FlowNode,
            content: <h3>Start</h3>,
            handles: [{ type: 'source', position: Position.Bottom }],
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
          }),
          DecisionNode: connectReactFlow({
            component: FlowNode,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          ActionNode: connectReactFlow({
            component: FlowNode,
            content: <h3>action</h3>,
            handles: [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ],
          }),
          LoopNode: connectReactFlow({
            component: FlowNode,
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
      >
        <Background gap={20} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
});
