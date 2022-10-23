import React from 'react';
import classNames from 'classnames';

import './styles';

export interface IStandardNodeProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  data?: INodeDataProps;
}

interface INodeDataProps {
  title?: string;
  description?: string;
}

export const StandardNode: React.FC<
  React.PropsWithChildren<IStandardNodeProps>
> = ({ className, style, data = {}, children }) => {
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
