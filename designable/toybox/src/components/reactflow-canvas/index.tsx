import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Position } from 'reactflow';
import { observer } from '@formily/reactive-react';
import { ReactFlowCanvas } from '@toy-box/flow-graph';
import {
  connectReactFlow,
  ExtendNode,
  FlowNode,
  HyperStepEdge,
  FixStepEdge,
} from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';
import { ExtendPanel } from '../extend-panel';

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
          hyperEdge: HyperStepEdge,
          fixEdge: FixStepEdge,
        },
        components: {
          StartNode: connectReactFlow(FlowNode, <h3>Start</h3>, [
            { type: 'source', position: Position.Bottom },
          ]),
          ExtendNode: connectReactFlow(
            ExtendNode,
            <ExtendPanel title="extend panel" />,
            [
              { type: 'target', position: Position.Top },
              { type: 'source', position: Position.Bottom },
            ]
          ),
          DecisionNode: connectReactFlow(FlowNode, undefined, [
            { type: 'target', position: Position.Top },
            { type: 'source', position: Position.Bottom },
          ]),
          ActionNode: connectReactFlow(FlowNode, <h3>action</h3>, [
            { type: 'target', position: Position.Top },
            { type: 'source', position: Position.Bottom },
          ]),
          LoopNode: connectReactFlow(FlowNode, <h3>Loop</h3>, [
            { type: 'target', position: Position.Top, id: Position.Top },
            { type: 'source', position: Position.Bottom, id: Position.Bottom },
            { type: 'target', position: Position.Left, id: Position.Left },
            { type: 'source', position: Position.Right, id: Position.Right },
          ]),
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
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
});
