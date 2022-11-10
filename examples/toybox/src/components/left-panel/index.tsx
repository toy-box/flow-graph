import React, { FC, useEffect } from 'react'
import { ItemStore } from '@toy-box/toybox-lib'
import { useMetaFlow } from '@toy-box/flow-node'
import { itemMap } from '../../data/itemMap'
import { observer } from '@formily/reactive-react'

import './componentItem.less'

export const LeftPanel = observer(() => {
  const metaFlow = useMetaFlow()
  useEffect(() => {
    console.log('left panel metaFlow', metaFlow)
  }, [metaFlow.flowType])
  if (metaFlow.flowType === 'FREE_START_UP') {
    return (
      <ItemStore
        className="flow-graph-left-panel"
        numPreRow={1}
        dataSource={itemMap}
        width={100}
        itemClassName="component-item-wrap"
      />
    )
  } else {
    return <></>
  }
})
