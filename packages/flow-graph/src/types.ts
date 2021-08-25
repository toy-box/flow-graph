import { IContextMenuItem } from './canvas';

export type FlowNodeType =
  | 'begin'
  | 'end'
  | 'decisionBegin'
  | 'decisionEnd'
  | 'loopBegin'
  | 'loopBack'
  | 'loopEnd'
  | 'forward';

export interface NodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: FlowNodeType;
  component?: string;
  label?: string;
  contextMenu?: IContextMenuItem[];
  onClick?: () => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface EdgeProps {
  source: string;
  target: string;
  vertices?: Point[];
  contextMenu?: IContextMenuItem[];
}
