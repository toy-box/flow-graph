import React from 'react';
import ReactDOM from 'react-dom';
import { FlowContext, Flow } from '@toy-box/flow-graph';
import { Panel, FlowCanvas } from '../src';
import './theme.less';

const flow = new Flow();

const App = () => {
  return (
    <div className="App">
      <FlowContext.Provider value={flow}>
        <Panel />
        <FlowCanvas />
      </FlowContext.Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
