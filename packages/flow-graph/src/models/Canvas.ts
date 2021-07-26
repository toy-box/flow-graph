export interface INodeMeta {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  sharp?: string;
}

export interface IEdgeMeta {
  id: string;
  source: string;
  target: string;
}

export interface ICanvas {
  addNode: (node: INodeMeta) => void;
  addNodes: (node: INodeMeta[]) => void;
  addEdge: (edge: any) => void;
  addEdges: (edge: any[]) => void;
}
