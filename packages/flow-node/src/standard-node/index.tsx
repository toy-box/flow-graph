import React from 'react'
import classNames from 'classnames'
import { Popover } from 'antd'
import { FlowNode } from '@toy-box/flow-graph'
import { ICustomEvent } from '../shared'
import { useEvent } from '../hooks'
import { NodePanel } from '../node-panel'

import './styles'

export interface IStandardNodeProps {
  id: string
  className?: string
  style?: React.CSSProperties
  data?: INodeDataProps
}

interface INodeDataProps {
  title?: string
  description?: string
}

export const StandardNode: React.FC<
  React.PropsWithChildren<IStandardNodeProps>
> = ({ id, className, style, data = {}, children }) => {
  const eventEngine = useEvent()
  const prefixCls = 'tbox-flow-node'
  const [active, setActive] = React.useState(false)
  React.useEffect(() => {
    const unsubscribe = eventEngine.subscribe((payload: ICustomEvent) => {
      if (payload.type === 'clickPane' || payload.type === 'moveStart') {
        setActive(false)
      } else if (payload.type === 'clickNode') {
        if ((payload as ICustomEvent<FlowNode>).data?.id !== id) {
          setActive(false)
        }
      }
    })
    return unsubscribe()
  }, [])

  const closeExtend = () => {
    setActive(false)
  }

  const { title, description } = data
  return (
    <React.Fragment>
      <Popover
        visible={active}
        trigger="click"
        onVisibleChange={(visible) => setActive(visible)}
        placement="bottom"
        content={<NodePanel closeExtend={closeExtend} nodeId={id} />}
        overlayClassName="no-padding"
      >
        <div className={classNames(prefixCls, className)} style={style}>
          {children}
        </div>
      </Popover>
      <div className={`${prefixCls}__label`}>
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </React.Fragment>
  )
}
