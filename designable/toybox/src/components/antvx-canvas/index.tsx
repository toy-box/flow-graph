import React, { useEffect } from 'react';
import { Graph } from '@antv/x6';
import '@antv/x6-react-shape';
import { AntvCanvas as FlowCanvas } from '@toy-box/flow-graph';
import {
  connect,
  StartNode,
  ExtendNode,
  EndNode,
  ActionNode,
  DecisionNode,
  RecordCreateNode,
} from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';
import { ExtendPanel } from '../extend-panel';
import { LabelPanel } from '../label-panel';

export const AntvxCanvas = () => {
  const flow = useFlow() as any;
  const style = {
    width: '1240px',
    height: '960px',
  };

  useEffect(() => {
    const graph = new Graph({
      container: document.getElementById('flow-canvas') || undefined,
      panning: true,
      grid: true,
      background: {
        color: '#fafafa',
      },
      frozen: true,
    });
    flow.setCanvas(
      new FlowCanvas({
        flowGraph: flow.flowGraph,
        canvas: graph,
        components: {
          StartNode: connect(StartNode, () => {
            return <div>start</div>;
          }),
          ExtendNode: connect(ExtendNode, <ExtendPanel title="extend panel" />),
          EndNode: connect(EndNode),
          DecisionNode: connect(
            DecisionNode,
            <ExtendPanel title="extend panel" />,
            <LabelPanel />
          ),
        },
      })
    );
  }, []);

  return <div id="flow-canvas" style={style}></div>;
};
