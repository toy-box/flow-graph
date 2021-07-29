import React, { useCallback } from 'react';
import { useFlow } from '../../hooks';

const STAND_SIZE = 50;

export const Panel = () => {
  const flow = useFlow();
  const init = useCallback(() => {
    flow.setFlowNode([
      {
        id: '001',
        type: 'begin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['002'],
        component: 'StartNode',
        contextMenu: [
          {
            text: 'menu-1',
            callback: () => console.log('menu-1'),
          },
        ],
      },
      {
        id: '002',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['100'],
      },
      {
        id: '100',
        type: 'forkBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['110', '120'],
      },
      {
        id: '110',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['111'],
      },
      {
        id: '120',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['121'],
      },
      {
        id: '111',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['200'],
      },
      {
        id: '121',
        type: 'cycleBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['122'],
      },
      {
        id: '122',
        type: 'forkBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['1221', '1223'],
      },
      {
        id: '1221',
        type: 'forkBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['12211', '12212'],
      },
      {
        id: '12211',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['1222'],
      },
      {
        id: '12212',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['1222'],
      },
      {
        id: '1222',
        type: 'forkEnd',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['1224'],
      },
      {
        id: '1223',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['1224'],
      },
      {
        id: '1224',
        type: 'forkEnd',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['123'],
      },
      {
        id: '123',
        type: 'cycleBack',
        width: 24,
        height: 24,
        targets: ['124'],
        component: 'ExtendNode',
      },
      {
        id: '124',
        type: 'cycleEnd',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['200'],
      },
      {
        id: '200',
        type: 'forkEnd',
        width: STAND_SIZE,
        height: STAND_SIZE,
      },
    ]);
  }, [flow]);
  return (
    <div>
      <button onClick={init}>init</button>
    </div>
  );
};
