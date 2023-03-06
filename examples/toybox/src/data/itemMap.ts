import React from 'react'
import { FlowNodeType } from '@toy-box/flow-node'

export interface ItemMapType {
  id: string
  type: FlowNodeType | string
  title: string
  icon?: any
  span?: number
  thumb?: string
}

export const itemMap: ItemMapType[] = [
  {
    id: 'Assignment',
    type: 'Assignment',
    title: 'toyboxStudio.flow.extend.assign',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
  {
    id: 'Decision',
    type: 'Decision',
    title: 'toyboxStudio.flow.extend.decision',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
  {
    id: 'Loop',
    type: 'Loop',
    title: 'toyboxStudio.flow.extend.loop',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
  // {
  //   id: 'Wait',
  //   key: 'Wait',
  //   type: 'Wait',
  //   title: '暂停',
  //   content: ComponentItem({ title: 'Pause', icon: 'titleText' }),
  // },
  // {
  //   id: 'Sort',
  //   key: 'Sort',
  //   type: 'Sort',
  //   title: '排序',
  //   content: ComponentItem({ title: 'Collection Sort', icon: 'titleText' }),
  // },
  // {
  //   id: 'RecordCreate',
  //   key: 'RecordCreate',
  //   type: 'RecordCreate',
  //   title: '创建记录',
  //   content: ComponentItem({ title: 'Create Records', icon: 'titleText' }),
  // },
  // {
  //   id: 'RecordUpdate',
  //   key: 'RecordUpdate',
  //   type: 'RecordUpdate',
  //   title: '更新记录',
  //   content: ComponentItem({ title: 'Update Records', icon: 'titleText' }),
  // },
  // {
  //   id: 'RecordDelete',
  //   key: 'RecordDelete',
  //   type: 'RecordDelete',
  //   title: '删除记录',
  //   content: ComponentItem({ title: 'Delete Records', icon: 'titleText' }),
  // },
  // {
  //   id: 'RecordLookup',
  //   key: 'RecordLookup',
  //   type: 'RecordLookup',
  //   title: '获取记录',
  //   content: ComponentItem({ title: 'Lookup Records', icon: 'titleText' }),
  // },
]

export const itemMapDatas: ItemMapType[] = [
  {
    id: 'RecordCreate',
    type: 'RecordCreate',
    title: 'toyboxStudio.flow.extend.recordCreate',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
  {
    id: 'RecordUpdate',
    type: 'RecordUpdate',
    title: 'toyboxStudio.flow.extend.recordUpdate',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
  {
    id: 'RecordDelete',
    type: 'RecordDelete',
    title: 'toyboxStudio.flow.extend.recordDelete',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
  {
    id: 'RecordLookup',
    type: 'RecordLookup',
    title: 'toyboxStudio.flow.extend.recordLookup',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
]

export const itemMapAction: ItemMapType[] = [
  {
    id: 'HttpCalls',
    type: 'HttpCalls',
    title: 'toyboxStudio.flow.extend.httpCalls',
    thumb:
      'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
  },
]
