import React, { useCallback } from 'react';
import { useNode } from '@toy-box/flow-nodes';
import './index.css';

export const LabelNodePanel = (props) => {
  const node: any = useNode();
  const style = {
    width: '100px',
    padding: '8px',
  };
  return (
    <div>
      <div className="tbox-flow-label-node-desc-name1">{node.node.id}</div>
    </div>
  );
};
