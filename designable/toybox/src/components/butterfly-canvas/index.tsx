import React, { useEffect } from 'react';
import { Canvas, Group, Node, Edge } from 'butterfly-dag';
import { FlowCanavs } from '@toy-box/flow-graph';
import { StartNode } from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';
import 'butterfly-dag/dist/index.css';

export const ButterflyCanvas = () => {
  const flow = useFlow();
  const style = {
    width: '1240px',
    height: '960px',
  };
  useEffect(() => {
    const canvas = new Canvas({
      root: document.getElementById('flow-canvas'),
      zoomable: true, //可缩放(选填)
      moveable: false, //可平移(选填)
      draggable: false,
      linkable: false,
      disLinkable: false,
    });
    flow.setCanvas(
      new FlowCanavs({
        type: 'butterfly',
        canvas,
        components: {
          begin: StartNode,
        },
      })
    );
  });
  return <div className="flow-canvas"></div>;
};
