import { useContext } from 'react'
import { FlowMetaNodeContext } from '../shared'

export const useFlowMetaNodeContext = () => {
  return useContext(FlowMetaNodeContext)
}
