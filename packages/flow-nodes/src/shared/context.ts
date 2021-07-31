import React from 'react';
import { Node } from '@antv/x6';

export interface INodeContext {
  node: Node;
}

export const NodeContext = React.createContext<INodeContext>({
  node: new Node(),
});
