import React, { FC, CSSProperties, useState } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import { PlayFill } from '@airclass/icons';
import { INodeProps } from '../types';
import './styles';

export interface StartNodeProps extends INodeProps {
  className?: string;
  style?: CSSProperties;
}

export const StartNode: FC<StartNodeProps> = ({
  className,
  style,
  content,
}) => {
  const [active, setActive] = useState(false);

  return (
    <Popover
      trigger="click"
      onVisibleChange={(visible) => setActive(visible)}
      placement="bottom"
      content={content}
      overlayClassName="no-padding"
    >
      <div className={classNames('tbox-flow-start-node')}>
        <div
          className={classNames('tbox-flow-start-node-instance', className)}
          style={style}
        >
          <PlayFill />
        </div>
      </div>
    </Popover>
  );
};
