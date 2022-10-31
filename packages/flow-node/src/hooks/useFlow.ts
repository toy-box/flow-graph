import { useMetaFlow } from './useMetaFlow'

export const useFlow = () => {
  const metaFlow = useMetaFlow()
  return metaFlow.flow
}
