import React, { useEffect, useRef } from 'react';
import { Canvas } from 'butterfly-dag';
import { ButterflyCanvas as FlowCanvas } from '@toy-box/flow-graph';
import { StartNode } from '@toy-box/flow-nodes';
import { useFlow } from '../../hooks';
import 'butterfly-dag/dist/index.css';
import './styles';

export const ButterflyCanvas = () => {
  const dom = useRef();
  const flow = useFlow();
  const style = {
    width: '1240px',
    height: '960px',
  };
  useEffect(() => {
    const canvas = new Canvas({
      root: dom,
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
    canvas.draw({
      nodes: [
        {
          id: 'org',
          name: 'org-node',
          left: 200,
          top: 200,
        },
      ],
    });
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
  return <div id="flow-canvas" ref={dom}></div>;
};
