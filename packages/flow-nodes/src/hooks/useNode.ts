import { useContext } from 'react';
import { NodeContext } from '../shared/context';

export const useNode = () => {
  const node = useContext(NodeContext);
  if (!node) {
    throw new Error('Can not found flow instance from context.');
  }
  return node;
};
