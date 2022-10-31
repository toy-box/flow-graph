import { useFlowContext } from './useFlowContext'

export const useTemplates = () => {
  const flowContext = useFlowContext()
  return flowContext.templates
}
