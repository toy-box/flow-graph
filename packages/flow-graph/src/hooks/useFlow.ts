import { useFlowGraph } from './useFlowGraph';

export const useFlow = () => {
  const flowGraph = useFlowGraph();
  return flowGraph.flow;
};
