import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import './styles';

export const ExtendNode: FC<INodeProps> = ({ content }) => {
  const [active, setActive] = useState(false);
  const renderContent = () => {
    if (React.isValidElement(content) && content.type) {
      const { key, props, ...restProps } = content;
      return {
        key,
        props: { ...props, closeExtend: () => setActive(false) },
        ...restProps,
      };
    }
    return content;
  };

  return (
    <Popover
      visible={active}
      trigger="click"
      onVisibleChange={(visible) => setActive(visible)}
      placement="bottom"
      content={renderContent()}
      overlayClassName="no-padding no-arrow"
    >
      <div className={classNames('tbox-flow-extend-node', { active })}>
        <PlusOutlined />
      </div>
    </Popover>
  );
};
