import React from 'react';
import classNames from 'classnames';

import './styles';

export interface IFlowNodeProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  data?: INodeDataProps;
}

interface INodeDataProps {
  title?: string;
  description?: string;
}

export const FlowNode: React.FC<React.PropsWithChildren<IFlowNodeProps>> = ({
  className,
  style,
  data = {},
  children,
}) => {
  const prefixCls = 'tbox-flow-node';
  const { title, description } = data;
  return (
    <div className={classNames(prefixCls, className)} style={style}>
      <div className={`${prefixCls}__label`}>
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
      {children}
    </div>
  );
};
