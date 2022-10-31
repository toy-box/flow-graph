import { useFlowContext } from './useFlowContext'

export const useMetaFlow = () => {
  const flowContext = useFlowContext()
  return flowContext.metaFlow
}
