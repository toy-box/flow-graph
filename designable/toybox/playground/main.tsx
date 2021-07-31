import React from 'react';
import ReactDOM from 'react-dom';
import { FlowContext, Flow } from '@toy-box/flow-graph';
import { Panel, AntvxCanvas } from '../src';
import './theme.less';

const flow = new Flow();

const App = () => {
  return (
    <div className="App">
      <h3>Go Flow</h3>
      <FlowContext.Provider value={flow}>
        <Panel />
        <AntvxCanvas />
        {/* <AntCanvas /> */}
      </FlowContext.Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
