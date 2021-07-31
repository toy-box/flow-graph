import React, { useCallback } from 'react';
import { useFlow } from '../../hooks';

const STAND_SIZE = 56;

export const Panel = () => {
  const flow = useFlow();
  const init = useCallback(() => {
    flow.setFlowNode([
      {
        id: '001',
        type: 'begin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['100'],
        component: 'StartNode',
      },
      {
        id: '100',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['200'],
      },
      {
        id: '200',
        type: 'forkBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['210', '211'],
      },
      {
        id: '210',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['220'],
      },
      {
        id: '211',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['220'],
      },
      {
        id: '220',
        type: 'forkEnd',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['300'],
        component: 'ExtendNode',
      },
      {
        id: '300',
        type: 'forward',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['310'],
      },
      {
        id: '310',
        type: 'cycleBegin',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['311'],
      },
      {
        id: '311',
        type: 'cycleBack',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['312'],
        component: 'ExtendNode',
      },
      {
        id: '312',
        type: 'cycleEnd',
        width: STAND_SIZE,
        height: STAND_SIZE,
        targets: ['400'],
        component: 'ExtendNode',
      },
      {
        id: '400',
        type: 'end',
        width: STAND_SIZE,
        height: STAND_SIZE,
        component: 'EndNode',
      },
    ]);
  }, [flow]);
  return (
    <div>
      <button onClick={init}>init</button>
    </div>
  );
};
