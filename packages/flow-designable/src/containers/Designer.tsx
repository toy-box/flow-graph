import React, { PropsWithChildren } from 'react'
import { GlobalRegistry } from '@toy-box/designable-core'
import { Layout } from '@toy-box/studio-base'
import { DesignerFlowContext, IDesignerFlowContextProps } from '../context'

export const Designer: React.FC<
  PropsWithChildren<IDesignerFlowContextProps>
> = ({ metaFlow, metaService, layoutMode, ...props }) => {
  return (
    <Layout {...props}>
      <DesignerFlowContext.Provider
        value={{
          metaFlow,
          layoutMode,
          metaService,
          GlobalRegistry,
          prefixCls: 'flow-layout',
        }}
      >
        {props.children}
      </DesignerFlowContext.Provider>
    </Layout>
  )
}

Designer.defaultProps = {
  prefixCls: 'tb-studio-',
  theme: 'light',
}
