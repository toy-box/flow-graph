import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import './styles';

export const ExtendNode: FC<INodeProps> = ({ content }) => {
  const [active, setActive] = useState(false);
  return (
    <Popover
      trigger="click"
      onVisibleChange={(visible) => setActive(visible)}
      placement="bottom"
      content={content}
      overlayClassName="no-padding"
    >
      <div className={classNames('tbox-flow-extend-node', { active })}>
        <PlusOutlined />
      </div>
    </Popover>
  );
};
