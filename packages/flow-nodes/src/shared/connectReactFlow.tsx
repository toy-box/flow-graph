import React, { FC, ReactNode } from 'react';
import { Handle, HandleProps } from 'reactflow';
import { IFlowNodeProps } from '../flow-node';

export function connectReactFlow(
  Target: FC<IFlowNodeProps>,
  content?: ReactNode,
  handles?: HandleProps[],
  props?: Record<string, any>
) {
  return () => {
    return (
      <React.Fragment>
        {(handles ?? []).map((handleProps, idx) => (
          <Handle
            key={idx}
            isConnectable={false}
            {...handleProps}
            style={{ opacity: 0 }}
          />
        ))}
        <Target {...props}>{content}</Target>
      </React.Fragment>
    );
  };
}