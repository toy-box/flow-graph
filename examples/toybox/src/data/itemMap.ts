import React from 'react'
import { FlowNodeType } from '@toy-box/flow-node'
import { ComponentItem } from '../components/left-panel/componentItem'

export interface ItemMapType {
  key: string
  type: FlowNodeType | string
  title: string
  content: React.ReactElement
}

export const itemMap: ItemMapType[] = [
  {
    key: '1',
    type: 'Assignment',
    title: '分配',
    content: ComponentItem({ title: 'Assignment', icon: 'titleText' }),
  },
  {
    key: '2',
    type: 'Decision',
    title: '决策',
    content: ComponentItem({ title: 'Decision', icon: 'titleText' }),
  },
  {
    key: '3',
    type: 'Loop',
    title: '循环',
    content: ComponentItem({ title: 'Loop', icon: 'titleText' }),
  },
]
