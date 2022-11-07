import React from 'react'
import { Button } from 'antd'
import cls from 'classnames'
import { useFlowMetaNodeContext, useMetaFlow } from '../hooks'
import './styles'

export type EditNodeType = (nodeId: string) => void
export interface INodePanelProps {
  className?: string
  style?: React.CSSProperties
  closeExtend?: () => void
  nodeId: string
  editNode?: EditNodeType
}

export const NodePanel: React.FC<INodePanelProps> = ({
  className,
  style,
  closeExtend,
  nodeId,
}) => {
  const prefixCls = 'tbox-flow-node-panel'
  const metaFlow = useMetaFlow()
  const { flowMetaNode, onEdit } = useFlowMetaNodeContext()
  const handleRemove = React.useCallback(() => {
    metaFlow.removeNodeWithBind(nodeId)
    metaFlow.flow.layoutFlow()
    closeExtend && closeExtend()
  }, [])

  const handleEdit = React.useCallback(() => {
    onEdit && onEdit(flowMetaNode)
    closeExtend && closeExtend()
  }, [])

  // todo:剪切功能
  // const handleExport = React.useCallback(() => {
  //   console.log('flowMetaNode', flowMetaNode.toJson())
  // }, [])
  return (
    <div className={cls(prefixCls, className)} style={style}>
      <Button type="text" size="small" onClick={handleEdit} block>
        Edit
      </Button>
      <Button type="text" size="small" onClick={handleRemove} danger block>
        Delete
      </Button>
      {/* <Button type="text" size="small" onClick={handleExport} block>
        Export
      </Button> */}
    </div>
  )
}
