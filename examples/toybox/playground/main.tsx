import React from 'react'
import ReactDOM from 'react-dom'
import { FlowContext, EventEngine } from '@toy-box/flow-node'
import { FlowModeEnum, MetaFlow } from '@toy-box/autoflow-core'
import { Panel, FlowCanvas } from '../src'
import { templates } from './nodes'
import './theme.less'

const eventEngine = new EventEngine()
const metaFlow = new MetaFlow(FlowModeEnum.EDIT)
const App = () => {
  return (
    <div className="App">
      <FlowContext.Provider
        value={{ metaFlow, templates, icons: {}, eventEngine }}
      >
        <Panel />
        <FlowCanvas />
      </FlowContext.Provider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
