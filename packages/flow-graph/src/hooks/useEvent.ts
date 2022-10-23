import { useFlowGraph } from './useFlowGraph';

export const useEvent = () => {
  const flowGraph = useFlowGraph();
  return flowGraph.eventEngine;
};
