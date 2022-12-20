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
    id: 'Decision',
    key: 'Decision',
    type: 'Decision',
    title: '决策',
    content: ComponentItem({ title: 'Decision', icon: 'titleText' }),
  },
  {
    id: 'Loop',
    key: 'Loop',
    type: 'Loop',
    title: '循环',
    content: ComponentItem({ title: 'Loop', icon: 'titleText' }),
  },
  {
    id: 'Pause',
    key: 'Pause',
    type: 'Pause',
    title: '暂停',
    content: ComponentItem({ title: 'Pause', icon: 'titleText' }),
  },
  {
    id: 'Sort',
    key: 'Sort',
    type: 'Sort',
    title: '排序',
    content: ComponentItem({ title: 'Collection Sort', icon: 'titleText' }),
  },
  {
    id: 'RecordCreate',
    key: 'RecordCreate',
    type: 'RecordCreate',
    title: '创建记录',
    content: ComponentItem({ title: 'Create Records', icon: 'titleText' }),
  },
  {
    id: 'RecordUpdate',
    key: 'RecordUpdate',
    type: 'RecordUpdate',
    title: '更新记录',
    content: ComponentItem({ title: 'Update Records', icon: 'titleText' }),
  },
  {
    id: 'RecordDelete',
    key: 'RecordDelete',
    type: 'RecordDelete',
    title: '删除记录',
    content: ComponentItem({ title: 'Delete Records', icon: 'titleText' }),
  },
  {
    id: 'RecordLookup',
    key: 'RecordLookup',
    type: 'RecordLookup',
    title: '获取记录',
    content: ComponentItem({ title: 'Lookup Records', icon: 'titleText' }),
  },
]
