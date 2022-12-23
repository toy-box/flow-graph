import React from 'react'
import classNames from 'classnames'
import { Popover } from 'antd'
import { DeleteFilled } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { FlowNode, LayoutModeEnum } from '@toy-box/flow-graph'
import { ICustomEvent } from '../shared'
import { useEvent, useFlowMetaNodeContext } from '../hooks'
import { NodePanel } from '../node-panel'

import './styles'

export interface IStandardNodeProps {
  id: string
  className?: string
  style?: React.CSSProperties
}

export const StandardNode: React.FC<
  React.PropsWithChildren<IStandardNodeProps>
> = observer(({ id, className, style, children }) => {
  const prefixCls = 'tbox-flow-node'
  const eventEngine = useEvent()
  const {
    flowMetaNode: { metaFlow },
    flowMetaNode,
  } = useFlowMetaNodeContext()
  const isAutoLayout = metaFlow.layoutMode === LayoutModeEnum.AUTO_LAYOUT
  const isNodeSelected =
    metaFlow.flow.canvas.nodes.findIndex(
      (node) => node.id === id && node.selected === true
    ) !== -1 && id !== 'start'
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

  const deleteNode = () => {
    metaFlow.flow.canvas.onNodesChange([{ id, type: 'remove' }])
  }

  return (
    <React.Fragment>
      <Popover
        visible={active}
        trigger="click"
        onVisibleChange={(visible) => isAutoLayout && setActive(visible)}
        placement="bottom"
        content={<NodePanel closeExtend={closeExtend} nodeId={id} />}
        overlayClassName="no-padding"
      >
        {!isAutoLayout && isNodeSelected && (
          <DeleteFilled className={`${prefixCls}__icon`} onClick={deleteNode} />
        )}
        <div className={classNames(prefixCls, className)} style={style}>
          {children}
        </div>
      </Popover>
      <div className={`${prefixCls}__label`}>
        <div className="title">{flowMetaNode?.name}</div>
        <div className="description">{flowMetaNode?.description}</div>
      </div>
    </React.Fragment>
  )
})
