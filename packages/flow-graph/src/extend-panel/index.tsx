import React, { ReactNode } from 'react';
import { Tabs } from 'antd';
import uniq from 'lodash.uniq';
import cls from 'classnames';
import { IFlowNodeTemplate } from '../types';
import { useNodes } from '../hooks';
import flowIcons from '../icons';

import './styles';

export interface IExtendPanelProps {
  className?: string;
  style?: React.CSSProperties;
  icons?: Record<string, ReactNode>;
  closeExtend?: () => void;
}

export const ExtendPanel: React.FC<IExtendPanelProps> = ({
  className,
  style,
  icons,
  closeExtend,
}) => {
  const nodes = useNodes();
  const prefixCls = 'tbox-flow-extend-panel';
  const groups = uniq(nodes.map((node) => node.group)).map((name) => ({
    name,
    nodes: nodes.filter((node) => node.group === name),
  }));

  const mixIcons = React.useMemo(
    () => ({
      ...flowIcons,
      ...icons,
    }),
    [icons]
  );

  const handleChoose = () => {
    closeExtend && closeExtend();
  };

  const nodeRender = (node: IFlowNodeTemplate, index: number) => {
    return (
      <li
        className={`${prefixCls}__node-list-item`}
        onClick={handleChoose}
        key={index}
      >
        <div className={`${prefixCls}__node-icon`}>
          {mixIcons[node.icon ?? 'flow']}
        </div>
        <div className={`${prefixCls}__node-content`}>
          <div className={`${prefixCls}__node-title`}>{node.title}</div>
          <div className={`${prefixCls}__node-description`}>
            {node.description}
          </div>
        </div>
      </li>
    );
  };
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
  );
};
