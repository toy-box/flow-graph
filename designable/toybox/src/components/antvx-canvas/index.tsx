import React, { useEffect } from 'react';
import { Graph } from '@antv/x6';
import { FlowCanavs } from '@toy-box/flow-graph';
import { StartNode } from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';

export const AntvxCanvas = () => {
  const flow = useFlow();
  const style = {
    width: '1240px',
    height: '960px',
  };

  useEffect(() => {
    const graph = new Graph({
      container: document.getElementById('flow-canvas') || undefined,
      scroller: {
        enabled: true,
        pannable: true,
      },
      grid: true,
      background: {
        color: '#fafafa',
      },
      frozen: true,
    });
    flow.setCanvas(
      new FlowCanavs({
        canvas: graph,
        components: {
          begin: StartNode,
        },
      }),
    );
  }, []);

  return <div id="flow-canvas" style={style}></div>;
};
