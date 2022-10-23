import React, { ReactNode } from 'react';
import { Edge, Node } from 'reactflow';
import { IFlowNodeProps } from './models';

export type FlowNodeType =
  | 'begin'
  | 'end'
  | 'decisionBegin'
  | 'decisionEnd'
  | 'loopBegin'
  | 'loopBack'
  | 'loopEnd'
  | 'forward'
  | 'extend'
  | 'shadow';

export interface INodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: FlowNodeType;
  component?: string;
  data?: Record<string, any>;
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

export interface INodeProps extends Node {
  content?: ReactNode;
}

export interface IFlowNodeTemplate {
  icon: string;
  title: string;
  description: string;
  group: string;
}
