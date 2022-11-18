import { useFreeFlow } from './useFreeFlow'

export const useDragFlow = () => {
  const freeFlow = useFreeFlow()
  return freeFlow.flow
}
