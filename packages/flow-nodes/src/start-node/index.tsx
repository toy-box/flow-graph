import React, { FC, CSSProperties, useState } from 'react';
import classNames from 'classnames';
import './styles';

export interface StartNodeProps {
  className?: string;
  style?: CSSProperties;
}

export const StartNode: FC<StartNodeProps> = ({ className, style }) => {
  // const [active, setActive] = useState(false)

  return (
    <div
      className={classNames('tbox-flow-start-node', 'active', className)}
      style={style}
    >
      <div className="tbox-flow-start-node-extend">extend</div>
    </div>
  );
};
