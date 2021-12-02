import React, { FC, ReactNode } from 'react';
import { Node } from '@antv/x6';
import { NodeContext } from '.';
import { INodeProps } from '../types';

export function connect(
  Target: FC<INodeProps>,
  content?: ReactNode,
  labelContent?: ReactNode,
  props?: Record<string, any>
) {
  return (node: Node) => {
    return (
      <NodeContext.Provider value={{ node }}>
        <Target {...props} content={content} labelContent={labelContent} />
      </NodeContext.Provider>
    );
  };
}
