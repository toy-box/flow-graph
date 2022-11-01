import React, { ReactNode } from 'react'
import { Tabs } from 'antd'
import uniq from 'lodash.uniq'
import cls from 'classnames'
import { INodeProps } from '@toy-box/flow-graph'
import { INodeTemplate } from '../types'
import { useFlow, useTemplates } from '../hooks'
import flowIcons from '../icons'

import './styles'
import { NodeMake } from '../shared'

export interface IExtendPanelProps {
  className?: string
  style?: React.CSSProperties
  icons?: Record<string, ReactNode>
  closeExtend?: () => void
  node?: INodeProps
}

export const ExtendPanel: React.FC<IExtendPanelProps> = ({
  className,
  style,
  icons,
  closeExtend,
  node,
}) => {
  const nodes = useTemplates()
  const flow = useFlow()
  const prefixCls = 'tbox-flow-extend-panel'
  const groups = uniq(nodes.map((node) => node.group)).map((name) => ({
    name,
    nodes: nodes.filter((node) => node.group === name),
  }))

  const mixIcons = React.useMemo(
    () => ({
      ...flowIcons,
      ...icons,
    }),
    [icons]
  )

  const handleChoose = (nodeTemplate: INodeTemplate<NodeMake>, at: string) => {
    const node = flow.flowGraph.getNode(at)
    // flow.batch(template.make(at, node.targets))
    nodeTemplate.make(at)
    closeExtend && closeExtend()
  }

  const nodeRender = (template: INodeTemplate<any>, index: number) => {
    return (
      <li
        className={`${prefixCls}__node-list-item`}
        onClick={() => handleChoose(template, node.id)}
        key={index}
      >
        <div className={`${prefixCls}__node-icon`}>
          {mixIcons[template.icon ?? 'flow']}
        </div>
        <div className={`${prefixCls}__node-content`}>
          <div className={`${prefixCls}__node-title`}>{template.title}</div>
          <div className={`${prefixCls}__node-description`}>
            {template.description}
          </div>
        </div>
      </li>
    )
  }
  return (
    <div className={cls(prefixCls, className)} style={style}>
      <h3 style={{ padding: '8px 8px 8px 4px' }}>Choose flow node</h3>
      <Tabs size="small" centered>
        {groups.map((nodeGroup) => (
          <Tabs.TabPane tab={nodeGroup.name} key={nodeGroup.name}>
            <ul className={`${prefixCls}__node-list`}>
              {nodeGroup.nodes.map((node, idx) => nodeRender(node, idx))}
            </ul>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  )
}
