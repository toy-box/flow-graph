import React, { FC, useEffect, useState, useCallback, useMemo } from 'react'
import { ItemStoreWrap, SimpleLayout } from '@toy-box/toybox-lib'
// import LayoutEditContext from './context';
import { ReactSortable, Sortable } from 'react-sortablejs'
import { StoreItem } from '@toy-box/toybox-lib/src/components/LayoutEdit/components/storeItem'
import { useMetaFlow, useFlow } from '@toy-box/flow-node'
import { itemMap } from '../../data/itemMap'
import { observer } from '@formily/reactive-react'
import { uid } from '@toy-box/toybox-shared'

import './componentItem.less'

export const LeftPanel = observer(() => {
  const metaFlow = useMetaFlow()
  const flow = useFlow()
  const layoutItems = [
    {
      key: 'a',
      type: 'base',
      index: 0,
    },
  ]
  const [layout, setLayout] = useState({ items: layoutItems })
  const [active, setActive] = useState()
  const [draging, setDraging] = useState()
  const change = useCallback(
    (state: any) => {
      console.log('state', state)
      setLayout(state)
    },
    [draging]
  )
  const style = {
    width: 100,
  }

  const list = useMemo(
    () => itemMap.map((item) => ({ id: item.key, ...item })),
    [itemMap]
  )
  useEffect(() => {
    console.log('draging', draging)
  }, [draging])
  const onDragEnd = (e) => {
    const { clientX, clientY } = e.originalEvent
    console.log('name-position', e.clone.outerText, clientX - 120, clientY)
    const newNode = {
      item: {
        id: '000',
        data: 'begin',
        position: {
          x: clientX - 120,
          y: clientY,
        },
      },
      type: 'add',
    }
    flow.canvas.onNodesChange([newNode])
    console.log(' flow.canvas.nodes', flow.canvas.nodes)
    // metaFlow.flow.addFlowNode(newNode)
    //  metaFlow.flow.layoutFlow()
  }
  if (metaFlow.flowType === 'FREE_START_UP') {
    return (
      <ReactSortable
        tag="div"
        className="flow-graph-left-panel"
        style={style}
        list={list}
        group={{ name: 'storeItem', pull: 'clone', put: false }}
        sort={false}
        setList={() => undefined}
        onEnd={onDragEnd}
        forceFallback={true}
      >
        {itemMap.map((item) => (
          <StoreItem
            key={item.key}
            item={item}
            className="component-item-wrap"
          />
        ))}
      </ReactSortable>
    )
  } else {
    return <></>
  }
})
