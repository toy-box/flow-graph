import React, { useEffect } from 'react';
import { Graph } from '@antv/x6';
import { AntvCanvas as FlowCanvas } from '@toy-box/flow-graph';
import { StartNode, ExtendNode } from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';

export const AntvxCanvas = () => {
  const flow = useFlow();
  const style = {
    width: '1240px',
    height: '960px',
  };

  useEffect(() => {
    const graph = new Graph({
      container: document.getElementById('flow-canvas'),
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
          StartNode,
          ExtendNode,
        },
      })
    );
  }, []);

  return <div id="flow-canvas" style={style}></div>;
};
