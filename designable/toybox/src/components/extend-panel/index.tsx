import React, { useCallback } from 'react';
import { useNode } from '@toy-box/flow-nodes';

export const ExtendPanel = (props) => {
  const node = useNode();
  const style = {
    width: '100px',
    padding: '8px',
  };
  const handle = useCallback(() => {
    props?.closeExtend && props.closeExtend();
  }, [props?.closeExtend]);
  return (
    <div style={style}>
      <div>{props.title}</div>
      <div onClick={handle}>循环</div>
      <div onClick={handle}>分支</div>
    </div>
  );
};
