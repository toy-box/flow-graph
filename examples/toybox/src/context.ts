import { createContext } from 'react'
import { IDesignerRegistry } from '@toy-box/designable-core'
import { FreeFlow, MetaFlow } from '@toy-box/autoflow-core'

export interface IDesignerFlowContextProps {
  // autoFlow: AutoFlow
  // metaService: MetaService
  GlobalRegistry?: IDesignerRegistry
  metaFlow: MetaFlow | FreeFlow
  prefixCls?: string
}

export const DesignerFlowContext =
  createContext<IDesignerFlowContextProps>(null)
