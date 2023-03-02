import { useContext } from 'react'
import { DesignerFlowContext } from '../context'

export const useFlowPrefix = (after = '') => {
  return (
    (useContext(DesignerFlowContext)?.prefixCls || 'flow-designable') + after
  )
}
