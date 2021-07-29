import React, { FC, CSSProperties } from 'react';
import { PlayFill } from '@airclass/icons';
import classNames from 'classnames';
import { Dropdown, Menu } from 'antd';
import './styles';

export interface StartNodeProps {
  className?: string;
  style?: CSSProperties;
}

export const StartNode: FC<StartNodeProps> = ({ className, style }) => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item disabled>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          2rd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div
        className={classNames('tbox-flow-start-node', 'active', className)}
        style={style}
      >
        <PlayFill />
      </div>
    </Dropdown>
  );
};
