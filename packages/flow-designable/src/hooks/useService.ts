import { useContext } from 'react'
import { DesignerFlowContext } from '../context'

export const useService = () => {
  return useContext(DesignerFlowContext)?.metaService
}
