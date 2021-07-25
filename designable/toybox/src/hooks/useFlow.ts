import { useContext } from 'react';
import { FlowContext } from '@toy-box/flow-graph';

export const useFlow = () => {
  const flow = useContext(FlowContext);
  if (!flow) {
    throw new Error('Can not found flow instance from context.');
  }
  return flow;
};
