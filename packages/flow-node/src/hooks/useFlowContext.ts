import { useContext } from 'react'
import { FlowContext } from '../shared'

export const useFlowContext = () => {
  const flowContext = useContext(FlowContext)
  if (!flowContext) {
    throw new Error('Can not found flowGraph instance from context.')
  }
  return flowContext
}
