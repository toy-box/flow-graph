import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import './styles';

export const ExtendNode: FC<INodeProps> = ({ content }) => {
  const [active, setActive] = useState(false);
  const handleOpenChange = (state: boolean) => {
    setActive(state);
  };
  const closeExtend = () => {
    setActive(false);
  };

  const renderContent = () => {
    if (React.isValidElement(content) && content.type) {
      const { key, props, ...restProps } = content;
      return {
        key,
        props: { ...props, closeExtend },
        ...restProps,
      };
    }
    return content;
  };

  return (
    <div className={classNames('tbox-flow-extend-node', { active })}>
      <Popover
        visible={active}
        trigger="click"
        onVisibleChange={(visible) => setActive(visible)}
        placement="bottom"
        content={renderContent()}
      >
        <div className={classNames('tbox-flow-extend-node', { active })}>
          <PlusOutlined />
        </div>
      </Popover>
      <button onClick={() => handleOpenChange(!active)}>
        <PlusOutlined />
      </button>
    </div>
  );
};
