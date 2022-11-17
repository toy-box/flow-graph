import { useFreeFlow } from './useFreeFlow'

export const useGraphFlow = () => {
  const freeFlow = useFreeFlow()
  return freeFlow.flow
}
