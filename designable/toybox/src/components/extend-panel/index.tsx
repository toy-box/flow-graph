import React from 'react';
import { useNode } from '@toy-box/flow-nodes';

export const ExtendPanel = () => {
  const node = useNode();
  const style = {
    width: '100px',
    padding: '8px',
  };
  return (
    <div style={style}>
      <div>{node.id}</div>
      <div>循环</div>
      <div>分支</div>
    </div>
  );
};
