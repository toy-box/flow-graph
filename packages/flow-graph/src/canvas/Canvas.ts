import { NodeProps, EdgeProps } from '../types';

export interface IContextMenuItem {
  icon?: string;
  text?: string;
  callback?: (id: string) => void;
}

export interface ICanvas {
  addNode: (node: NodeProps) => void;
  addNodes: (node: NodeProps[]) => void;
  addEdge: (edge: EdgeProps) => void;
  addEdges: (edge: EdgeProps[]) => void;
}
