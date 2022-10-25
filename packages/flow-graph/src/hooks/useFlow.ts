import { useFlowContext } from './useFlowContext';

export const useFlow = () => {
  const flowContext = useFlowContext();
  return flowContext.flow;
};
