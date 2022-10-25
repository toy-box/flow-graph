import { useFlowContext } from './useFlowContext';

export const useEvent = () => {
  const flowGraph = useFlowContext();
  return flowGraph.eventEngine;
};
