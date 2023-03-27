import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FlowContext, EventEngine } from '@toy-box/flow-node'
import { FlowModeEnum, MetaFlow, FreeFlow } from '@toy-box/autoflow-core'
import { icons } from '@toy-box/studio-base'
import { GlobalRegistry } from '@toy-box/designable-core'
import { Panel, Shortcut, shortcutOnEdit } from '../src'
import { freeInitMeta, freeMeta } from '../src/data/flowData'
import { deleteDialog, FlowCanvas } from '@toy-box/flow-designable'
import { nodeTemplatesProvider } from './nodes'
import '../src/styles/theme.less'

GlobalRegistry.setDesignerLanguage('en-US')
GlobalRegistry.registerDesignerIcons(icons)

export const App: React.FC = () => {
  const eventEngine = new EventEngine()
  const metaFlow = new MetaFlow(FlowModeEnum.EDIT)
  const freeFlow = new FreeFlow(FlowModeEnum.EDIT)
  useEffect(() => {
    metaFlow.setMetaFlow(
      {
        resources: undefined,
        nodes: undefined,
      },
      'AUTO_START_UP'
    )
    freeFlow.setMetaFlow(freeMeta, 'AUTO_START_UP')
  }, [metaFlow, freeFlow])
  return (
    <div className="App">
      <FlowContext.Provider
        value={{
          metaFlow: freeFlow,
          templates: nodeTemplatesProvider(metaFlow, freeFlow),
          icons: {},
          eventEngine,
          connectDialog: {
            deleteDialog,
          },
        }}
      >
        <Panel metaFlow={freeFlow} />
      </FlowContext.Provider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
