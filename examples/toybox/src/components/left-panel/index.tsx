import React from 'react'
import { useMetaFlow } from '@toy-box/flow-node'
import { itemMap } from '../../data/itemMap'
import { observer } from '@formily/reactive-react'
import classNames from 'classnames'

import './componentItem.less'

export const LeftPanel = observer(() => {
  const metaFlow = useMetaFlow()
  const style = {
    width: 100,
  }
  const dragStart = (key, e) => {
    e.dataTransfer.setData('text/plain', key)
  }

  if (metaFlow.flowType === 'FREE_START_UP') {
    return (
      <div className="flow-graph-left-panel" style={style}>
        {itemMap.map((item) => (
          <div
            key={item.key}
            draggable
            className={classNames(
              `tobx-layout-edit__item-wrapper`,
              `component-item-wrap`
            )}
            onDragStart={(e) => dragStart(item.key, e)}
          >
            {item.content}
          </div>
        ))}
      </div>
    )
  } else {
    return <></>
  }
})
