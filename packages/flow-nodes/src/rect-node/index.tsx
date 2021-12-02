import React, { FC, CSSProperties, useMemo, useState, ReactNode } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import {
  Assign,
  Create,
  Search,
  Edit,
  Delete,
  Sort,
  Loop,
  Magic,
} from '../icons';
import './styles';

export interface RectNodeProps extends INodeProps {
  className?: string;
  icon?: ReactNode;
  color?: string;
  style?: CSSProperties;
}

export const RectNode: FC<RectNodeProps> = ({
  className,
  style,
  icon,
  color,
  content,
  labelContent,
}) => {
  const [active, setActive] = useState(false);
  const innerStyle = useMemo(
    () => ({
      ...style,
      background: color,
      color: 'white',
    }),
    [style, color]
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
  return (
    <div>
      <Popover
        visible={active}
        trigger="click"
        onVisibleChange={(visible) => setActive(visible)}
        placement="bottom"
        content={renderContent()}
        overlayClassName="no-padding no-arrow"
      >
        <div
          className={classNames('tbox-flow-rect-node', className)}
          style={innerStyle as any}
        >
          {icon}
        </div>
      </Popover>
      {labelContent}
    </div>
  );
};

export const AssignNode = (props) => {
  return <RectNode icon={<Assign />} {...props} />;
};

export const RecordCreateNode = (props) => {
  return <RectNode icon={<Create />} {...props} />;
};

export const RecordSearchNode = (props) => {
  return <RectNode icon={<Search />} {...props} />;
};

export const RecordEdithNode = (props) => {
  return <RectNode icon={<Edit />} {...props} />;
};

export const RecordDeletehNode = (props) => {
  return <RectNode icon={<Delete />} {...props} />;
};

export const CollectionSortNode = (props) => {
  return <RectNode icon={<Sort />} {...props} />;
};

export const LoopNode = (props) => {
  return <RectNode icon={<Loop />} {...props} />;
};

export const ActionNode = (props) => {
  return <RectNode icon={<Magic />} {...props} />;
};
