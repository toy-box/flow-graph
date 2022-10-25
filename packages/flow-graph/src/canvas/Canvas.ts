import { INode, IEdge } from '../types';

export interface IContextMenuItem {
  icon?: string;
  text?: string;
  callback?: (id: string) => void;
}

export interface ICanvas {
  addNode: (node: INode) => void;
  addNodes: (node: INode[]) => void;
  setNodes: (node: INode[]) => void;
  addEdge: (edge: IEdge) => void;
  addEdges: (edge: IEdge[]) => void;
  setEdges: (edge: IEdge[]) => void;
}
