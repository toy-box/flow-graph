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
  labelContent,
}) => {
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
    <div>
      <Popover
        trigger="click"
        onVisibleChange={(visible) => setActive(visible)}
        placement="bottom"
        content={renderContent()}
        overlayClassName="no-padding"
      >
        <div className={classNames('tbox-flow-start-node')}>
          <div
            className={classNames('tbox-flow-start-node-instance', className)}
            style={style as any}
          >
            <PlayFill />
          </div>
        </div>
      </Popover>
      {labelContent}
    </div>
  );
};
