import React from 'react'
import { FlowNodeType } from '@toy-box/flow-node'
import { ComponentItem } from '../components/left-panel/componentItem'

export interface ItemMapType {
  id: string
  key: string
  type: FlowNodeType | string
  title: string
  content: React.ReactElement
}

export const itemMap: ItemMapType[] = [
  {
    id: 'Assignment',
    key: 'Assignment',
    type: 'Assignment',
    title: '分配',
    content: ComponentItem({ title: 'Assignment', icon: 'titleText' }),
  },
  {
    id: 'Assignment',
    key: 'Decision',
    type: 'Decision',
    title: '决策',
    content: ComponentItem({ title: 'Decision', icon: 'titleText' }),
  },
  {
    id: 'Assignment',
    key: 'Loop',
    type: 'Loop',
    title: '循环',
    content: ComponentItem({ title: 'Loop', icon: 'titleText' }),
  },
]
