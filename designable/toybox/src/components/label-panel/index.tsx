import React, { useCallback } from 'react';
import { useNode } from '@toy-box/flow-nodes';
import './index.css';

export const LabelPanel = (props) => {
  const node: any = useNode();
  const style = {
    width: '100px',
    padding: '8px',
  };
  return (
    <div className="tbox-flow-label-node-desc">
      <div className="tbox-flow-label-node-desc-name">{node.node.id}</div>
      <div>分配</div>
    </div>
  );
};
