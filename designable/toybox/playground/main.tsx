import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FlowContext, Flow } from '@toy-box/flow-graph';
import { AntvxCanvas, Panel } from '../src';

const flow = new Flow();

const App = () => {
  return (
    <div className="App">
      <h3>Go Flow</h3>
      <FlowContext.Provider value={flow}>
        <Panel />
        <AntvxCanvas />
      </FlowContext.Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
