import { createContext } from 'react'
import { IDesignerRegistry } from '@toy-box/designable-core'
import { FreeFlow, MetaFlow } from '@toy-box/autoflow-core'
import { LayoutModeEnum } from '@toy-box/flow-graph'
import { MetaService } from './interface'

export interface IDesignerFlowContextProps {
  metaService: MetaService
  layoutMode: LayoutModeEnum
  GlobalRegistry?: IDesignerRegistry
  metaFlow: MetaFlow | FreeFlow
  prefixCls?: string
  theme?: 'dark' | 'light' | string
  variables?: Record<string, string>
  position?: 'fixed' | 'absolute' | 'relative'
}

export const DesignerFlowContext =
  createContext<IDesignerFlowContextProps>(null)
