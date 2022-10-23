import React, { useCallback } from 'react';
import { useFlow } from '@toy-box/flow-graph';

const BASE_SIZE = 30;
const STAND_SIZE = BASE_SIZE * 2;

export const Panel = () => {
  const flow = useFlow();
  const update = useCallback(() => {
    flow.setFlowNode([
      {
        id: '000',
        type: 'begin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'StartNode',
        targets: ['001'],
        data: {
          title: '开始',
          description: '开始节点',
        },
      },
      {
        id: '001',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['002'],
      },
      {
        id: '002',
        type: 'decisionBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'DecisionNode',
        decisionEndTarget: '005',
        targets: [
          { id: '002-1', label: 'goto 002-1' },
          { id: '002-2', label: 'goto 002-2' },
        ],
        data: {
          title: '分支',
          description: '分支路线选择',
        },
      },
      {
        id: '002-1',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['002-1-1'],
      },
      {
        id: '002-2',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['002-2-2'],
      },
      {
        id: '002-1-1',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'ActionNode',
        targets: ['002-1-2'],
      },
      {
        id: '002-1-2',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['002-1-3'],
      },
      {
        id: '002-1-3',
        type: 'loopBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'LoopNode',
        loopBackTarget: '002-3-2',
        loopEndTarget: '002-1-5',
        targets: ['002-1-4'],
      },
      {
        id: '002-1-4',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['002-3'],
      },
      {
        id: '002-3',
        type: 'loopBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'LoopNode',
        loopBackTarget: '002-3-1',
        loopEndTarget: '002-3-2',
        targets: ['002-3-1'],
      },
      {
        id: '002-3-1',
        type: 'loopBack',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'ExtendNode',
        targets: ['002-3-2'],
      },
      {
        id: '002-3-2',
        type: 'loopEnd',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['002-1-5'],
      },
      {
        id: '002-1-5',
        type: 'loopEnd',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['005'],
      },
      {
        id: '002-2-2',
        type: 'decisionBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        decisionEndTarget: '004',
        component: 'DecisionNode',
        targets: [
          { id: '003-1', label: 'goto 003-1' },
          { id: '003-2', label: 'goto 003-2' },
          { id: '003-3', label: 'goto 003-3' },
        ],
      },
      {
        id: '003-1',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['003-1-1'],
      },
      {
        id: '003-2',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['003-2-2'],
      },
      {
        id: '003-3',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['003-3-3'],
      },
      {
        id: '003-1-1',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'ActionNode',
        targets: ['003-1-2'],
        data: {
          title: '开始',
          description: '开始节点',
        },
      },
      {
        id: '003-1-2',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['004'],
      },
      {
        id: '003-2-2',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'ActionNode',
        targets: ['003-2-2-2'],
        data: {
          title: '开始',
          description: '开始节点',
        },
      },
      {
        id: '003-3-3',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'ActionNode',
        targets: ['003-3-3-3'],
      },
      {
        id: '003-2-2-2',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['004'],
      },
      {
        id: '003-3-3-3',
        type: 'forward',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['004'],
      },
      {
        id: '004',
        type: 'decisionEnd',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
        targets: ['005'],
      },
      {
        id: '005',
        type: 'decisionEnd',
        width: STAND_SIZE / 2,
        height: STAND_SIZE / 2,
        component: 'ExtendNode',
      },
    ]);
  }, []);
  return (
    <div>
      <button onClick={update}>update</button>
    </div>
  );
};
