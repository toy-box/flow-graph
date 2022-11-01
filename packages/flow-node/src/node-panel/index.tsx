import React from 'react'
import { Button } from 'antd'
import cls from 'classnames'
import { useFlow, useMetaFlow } from '../hooks'
import './styles'

export interface INodePanelProps {
  className?: string
  style?: React.CSSProperties
  closeExtend?: () => void
  nodeId: string
}

export const NodePanel: React.FC<INodePanelProps> = ({
  className,
  style,
  closeExtend,
  nodeId,
}) => {
  const prefixCls = 'tbox-flow-node-panel'
  const metaFlow = useMetaFlow()
  const handleRemove = React.useCallback(() => {
    metaFlow.removeNodeWithBind(nodeId)
    metaFlow.flow.layoutFlow()
    closeExtend && closeExtend()
  }, [])
  return (
    <div className={cls(prefixCls, className)} style={style}>
      <Button type="text" size="small" block>
        Edit
      </Button>
      <Button type="text" size="small" onClick={handleRemove} danger block>
        Delete
      </Button>
    </div>
  )
}
