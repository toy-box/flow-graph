import React, { useEffect } from 'react';
import { Canvas } from 'butterfly-dag';
import { ButterflyCanvas as FlowCanvas } from '@toy-box/flow-graph';
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
    const root = document.getElementById('flow-canvas');
    console.log('root', root);
    const canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true, // 可连线
      draggable: true, // 可拖动
      zoomable: true, // 可放大
      moveable: true, // 可平移
      theme: {
        edge: {
          shapeType: 'Manhattan',
          defaultAnimate: true,
        },
      },
    });
    console.log('FlowCanvas', FlowCanvas);
    flow.setCanvas(
      new FlowCanvas({
        type: 'butterfly',
        canvas,
        components: {
          begin: StartNode,
        },
      })
    );
  });
  return <div id="flow-canvas" className="flow-canvas"></div>;
};
