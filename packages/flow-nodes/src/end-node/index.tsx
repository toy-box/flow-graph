import React, { FC, CSSProperties } from 'react';
import classNames from 'classnames';
import './styles';

export interface EndNodeProps {
  className?: string;
  style?: CSSProperties;
}

export const EndNode: FC<EndNodeProps> = ({ className, style }) => {
  return (
    <div
      className={classNames('tbox-flow-end-node', className)}
      style={style}
    ></div>
  );
};
