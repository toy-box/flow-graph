import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import './styles';

export const LabelNode: FC<INodeProps> = ({ content, labelContent }) => {
  return (
    <div>
      <div className={classNames('tbox-flow-label-node')}>
        {/* <PlusOutlined /> */}
        {content}
      </div>
    </div>
  );
};
