import React from 'react';
import ReactDOM from 'react-dom';
import { FlowGraphContext, Flow, EventEngine } from '@toy-box/flow-graph';
import { Panel, FlowCanvas } from '../src';
import { nodes } from './nodes';
import './theme.less';

const flow = new Flow();
const eventEngine = new EventEngine();
const App = () => {
  return (
    <div className="App">
      <FlowGraphContext.Provider
        value={{ flow, icons: {}, nodes, eventEngine }}
      >
        <Panel />
        <FlowCanvas />
      </FlowGraphContext.Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
