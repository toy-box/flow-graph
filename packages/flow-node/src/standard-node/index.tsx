import React from 'react'
import classNames from 'classnames'
import { Popover } from 'antd'
import { EdgeRemoveChange } from 'reactflow'
import { DeleteFilled } from '@ant-design/icons'
import { observer } from '@formily/reactive-react'
import { FlowNode, LayoutModeEnum, FlowModeEnum } from '@toy-box/flow-graph'
import { FreeFlow } from '@toy-box/autoflow-core'
import { ICustomEvent } from '../shared'
import {
  useEvent,
  useFlowMetaNodeContext,
  useFreeFlow,
  useMetaFlow,
  useFlowContext,
} from '../hooks'
import { NodePanel } from '../node-panel'

import './styles'

export interface IStandardNodeProps {
  id: string
  className?: string
  style?: React.CSSProperties
  type: string
}

export const StandardNode: React.FC<
  React.PropsWithChildren<IStandardNodeProps>
> = observer(({ id, className, style, children }) => {
  const prefixCls = 'tbox-flow-node'
  const eventEngine = useEvent()
  const freeFlow = useFreeFlow()
  const metaFlow = useMetaFlow()
  const { connectDialog } = useFlowContext()
  const {
    // flowMetaNode: { metaFlow },
    flowMetaNode,
  } = useFlowMetaNodeContext()
  const isAutoLayout = metaFlow.layoutMode === LayoutModeEnum.AUTO_LAYOUT
  const isEditMode = metaFlow.mode === FlowModeEnum.EDIT
  const node = freeFlow.flow.canvas.nodes.find((node) => node.id === id)
  const isNodeSelected =
    node && node.selected === true && node.type !== 'StartNode'
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
    const dialog = connectDialog.deleteDialog()
    dialog
      .forOpen((payload, next) => {
        next()
        // setTimeout(() => {
        //   next({})
        // }, 500)
      })
      .forConfirm((payload, next) => {
        // if (node) {
        //   const deleteEdges = freeFlow.flow.canvas.edges
        //     .map(({ id: edgeId, source, target }) => {
        //       if (id === source || id === target) {
        //         const target: EdgeRemoveChange = { id: edgeId, type: 'remove' }
        //         return target
        //       }
        //     })
        //     .filter(Boolean)
        //   deleteEdges &&
        //     metaFlow.flow.canvas.onEdgesChange({
        //       changes: deleteEdges,
        //       freeFlow: freeFlow as FreeFlow,
        //     })
        // }
        metaFlow.flow.canvas.onNodesChange({
          changes: [{ id, type: 'remove' }],
          freeFlow: freeFlow as FreeFlow,
        })
        next(payload)
      })
      .forCancel((payload, next) => {
        next(payload)
      })
      .open()
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
        {!isAutoLayout && isNodeSelected && isEditMode && (
          <DeleteFilled className={`${prefixCls}__icon`} onClick={deleteNode} />
        )}
        <div
          className={classNames(
            prefixCls,
            className,
            isNodeSelected && 'flow-node__selected'
          )}
          style={style}
        >
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
