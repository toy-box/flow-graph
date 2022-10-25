import { useFlowContext } from './useFlowContext';

export const useNodes = () => {
  const flowGraph = useFlowContext();
  return flowGraph.nodes;
};
