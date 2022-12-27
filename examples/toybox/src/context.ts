import { createContext } from 'react'
import { IDesignerRegistry } from '@toy-box/designable-core'

export interface IDesignerFlowContextProps {
  // autoFlow: AutoFlow
  // metaService: MetaService
  GlobalRegistry: IDesignerRegistry
  prefixCls?: string
}

export const DesignerFlowContext =
  createContext<IDesignerFlowContextProps>(null)
