import React, { useCallback } from 'react';
import { useFlow } from '../../hooks';

export const Panel = () => {
  const flow = useFlow();
  const init = useCallback(() => {
    flow.setFlowNode([
      {
        id: '001',
        type: 'begin',
        width: 50,
        height: 50,
        targets: ['002'],
      },
      {
        id: '002',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['100'],
      },
      {
        id: '100',
        type: 'forkBegin',
        width: 50,
        height: 50,
        targets: ['110', '120'],
      },
      {
        id: '110',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['111'],
      },
      {
        id: '120',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['121'],
      },
      {
        id: '111',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['200'],
      },
      {
        id: '121',
        type: 'cycleBegin',
        width: 50,
        height: 50,
        targets: ['122'],
      },
      {
        id: '122',
        type: 'forkBegin',
        width: 50,
        height: 50,
        targets: ['1221', '1223'],
      },
      {
        id: '1221',
        type: 'forkBegin',
        width: 50,
        height: 50,
        targets: ['12211', '12212'],
      },
      {
        id: '12211',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['1222'],
      },
      {
        id: '12212',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['1222'],
      },
      {
        id: '1222',
        type: 'forkEnd',
        width: 50,
        height: 50,
        targets: ['1224'],
      },
      {
        id: '1223',
        type: 'forward',
        width: 50,
        height: 50,
        targets: ['1224'],
      },
      {
        id: '1224',
        type: 'forkEnd',
        width: 50,
        height: 50,
        targets: ['123'],
      },
      {
        id: '123',
        type: 'cycleBack',
        width: 50,
        height: 50,
        targets: ['124'],
      },
      {
        id: '124',
        type: 'cycleEnd',
        width: 50,
        height: 50,
        targets: ['200'],
      },
      {
        id: '200',
        type: 'forkEnd',
        width: 50,
        height: 50,
      },
    ]);
  }, [flow]);
  return (
    <div>
      <button onClick={init}>init</button>
    </div>
  );
};
