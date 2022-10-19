import React from 'react';
import classNames from 'classnames';

import './styles';

export interface IFlowNodeProps {
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FlowNode: React.FC<IFlowNodeProps> = ({
  title,
  description,
  className,
  style,
  children,
}) => {
  const prefixCls = 'tbox-flow-node';

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
