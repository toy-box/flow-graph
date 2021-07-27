export type FlowNodeType =
  | 'begin'
  | 'end'
  | 'forkBegin'
  | 'forkEnd'
  | 'cycleBegin'
  | 'cycleBack'
  | 'cycleEnd'
  | 'forward';

export interface NodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: FlowNodeType;
  component: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface EdgeProps {
  source: string;
  target: string;
  vertices?: Point[];
}
