import React from 'react'
import ReactDOM from 'react-dom'
import { FlowContext, Flow, EventEngine } from '@toy-box/flow-graph'
import { Panel, FlowCanvas } from '../src'
import { nodes } from './nodes'
import './theme.less'

const flow = new Flow()
const eventEngine = new EventEngine()
const App = () => {
  return (
    <div className="App">
      <FlowContext.Provider value={{ flow, icons: {}, nodes, eventEngine }}>
        <Panel />
        <FlowCanvas />
      </FlowContext.Provider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
