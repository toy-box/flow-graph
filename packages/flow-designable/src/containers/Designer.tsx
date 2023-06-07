import React, { PropsWithChildren } from 'react'
import { GlobalRegistry } from '@toy-box/designable-core'
import { Layout, useLocale } from '@toy-box/studio-base'
import { DesignerFlowContext, IDesignerFlowContextProps } from '../context'

export const Designer: React.FC<
  PropsWithChildren<IDesignerFlowContextProps>
> = ({ metaFlow, metaService, layoutMode, ...props }) => {
  const obj = {
    forEachItem: useLocale('flowDesigner.flow.form.loop.firstItem'),
    afterLastItem: useLocale('flowDesigner.flow.form.loop.lastItem'),
  }
  metaFlow.setI8nDataMap(obj)
  return (
    <Layout {...props}>
      <DesignerFlowContext.Provider
        value={{
          metaFlow,
          layoutMode,
          metaService,
          GlobalRegistry,
          prefixCls: 'flow-designable',
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
