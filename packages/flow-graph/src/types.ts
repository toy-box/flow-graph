import { IContextMenuItem } from './canvas';

export type FlowNodeType =
  | 'begin'
  | 'end'
  | 'decisionBegin'
  | 'decisionEnd'
  | 'loopBegin'
  | 'loopBack'
  | 'loopEnd'
  | 'forward'
  | 'extend';

export interface NodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: FlowNodeType;
  component?: string;
  label?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface EdgeProps {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  label?: string;
  data?: any;
}
