import { INodeProps, EdgeProps } from '../types';

export interface IContextMenuItem {
  icon?: string;
  text?: string;
  callback?: (id: string) => void;
}

export interface ICanvas {
  addNode: (node: INodeProps) => void;
  addNodes: (node: INodeProps[]) => void;
  addEdge: (edge: EdgeProps) => void;
  addEdges: (edge: EdgeProps[]) => void;
}
