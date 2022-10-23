import { useContext } from 'react';
import { FlowGraphContext } from '../shared';

export const useFlowGraph = () => {
  const flowGraph = useContext(FlowGraphContext);
  if (!flowGraph) {
    throw new Error('Can not found flowGraph instance from context.');
  }
  return flowGraph;
};
