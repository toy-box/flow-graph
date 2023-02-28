import { useContext } from 'react'
import { DesignerFlowContext } from '../context'

export const useDesigner = () => {
  return useContext(DesignerFlowContext)
}
