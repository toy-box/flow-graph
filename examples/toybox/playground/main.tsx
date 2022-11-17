import React from 'react'
import ReactDOM from 'react-dom'
import { FlowContext, EventEngine } from '@toy-box/flow-node'
import { FlowModeEnum, MetaFlow, FreeFlow } from '@toy-box/autoflow-core'
import { Panel, FlowCanvas, LeftPanel } from '../src'
import { nodeTemplatesProvider } from './nodes'
import './theme.less'

const eventEngine = new EventEngine()
const metaFlow = new MetaFlow(FlowModeEnum.EDIT)
const freeFlow = new FreeFlow(FlowModeEnum.EDIT)
const App = () => {
  return (
    <div className="App">
      <FlowContext.Provider
        value={{
          metaFlow,
          freeFlow,
          templates: nodeTemplatesProvider(metaFlow),
          icons: {},
          eventEngine,
        }}
      >
        <Panel />
        <LeftPanel />
        <FlowCanvas />
      </FlowContext.Provider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
