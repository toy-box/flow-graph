import { useFlowContext } from './useFlowContext'

export const useFreeFlow = () => {
  const flowContext = useFlowContext()
  return flowContext.metaFlow
}
