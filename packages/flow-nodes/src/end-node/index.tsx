import React, { FC, CSSProperties, useState } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import { StopFill } from '@airclass/icons';
import { INodeProps } from '../types';
import './styles';

export interface EndNodeProps extends INodeProps {
  className?: string;
  style?: CSSProperties;
}

export const EndNode: FC<EndNodeProps> = ({
  className,
  style,
  content,
  labelContent,
}) => {
  const [active, setActive] = useState(false);
  const render = (
    <div
      className={classNames('tbox-flow-end-node', className)}
      style={style as any}
    >
      <StopFill />
      {labelContent}
    </div>
  );
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
  return content ? (
    <Popover
      trigger="click"
      onVisibleChange={(visible) => setActive(visible)}
      placement="bottom"
      content={renderContent()}
      overlayClassName="no-padding"
    >
      {render}
    </Popover>
  ) : (
    render
  );
};
