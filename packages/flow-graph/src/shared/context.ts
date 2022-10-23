import React, { ReactNode } from 'react';
import { Flow } from '../models';
import { IFlowNodeTemplate } from '../types';
import { EventEngine } from './event';

export interface IFlowGraphContextProps {
  flow: Flow;
  nodes: IFlowNodeTemplate[];
  icons: Record<string, ReactNode>;
  eventEngine: EventEngine;
}

export const FlowGraphContext = React.createContext<
  IFlowGraphContextProps | undefined
>(undefined);
