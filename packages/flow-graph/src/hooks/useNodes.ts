import { useFlowGraph } from './useFlowGraph';

export const useNodes = () => {
  const flowGraph = useFlowGraph();
  return flowGraph.nodes;
};
