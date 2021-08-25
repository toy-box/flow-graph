import React, { FC, CSSProperties, useState } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import './styles';

export interface DecisionNodeProps extends INodeProps {
  className?: string;
  style?: CSSProperties;
}

export const DecisionNode: FC<DecisionNodeProps> = ({
  className,
  style,
  content,
}) => {
  const [active, setActive] = useState(false);

  return (
    <Popover
      visible={active}
      trigger="click"
      onVisibleChange={(visible) => setActive(visible)}
      placement="bottom"
      content={content}
      overlayClassName="no-padding no-arrow"
    >
      <div className={classNames('tbox-flow-decision-node')}>
        <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1">
          <g stroke="none" fill="none">
            <polygon fill="#ED8A19" points="28 0 56 28 28 56 0 28"></polygon>
            <g
              transform="translate(28.500000, 28.000000) scale(1, -1) translate(-28.500000, -28.000000) translate(15.000000, 14.000000)"
              fill="white"
            >
              <path
                d="M12,5.33333333 L8,5.33333333 L13.3333333,0 L18.6666667,5.33333333 L14.6666667,5.33333333 L14.6666667,11.24 C13.6666667,11.8533333 12.7733333,12.6133333 12,13.4933333 L12,5.33333333 M26.6666667,13.3333333 L21.3333333,8 L21.3333333,12 C16.5218003,11.8021293 12.4077607,15.4283613 12,20.2266667 C9.91844727,20.9657153 8.82720574,23.2495706 9.56,25.3333333 C10.2990487,27.4148861 12.5829039,28.5061276 14.6666667,27.7733333 C16.7461018,27.0319347 17.8363022,24.7502583 17.1066667,22.6666667 C16.7066667,21.52 15.8,20.6266667 14.6666667,20.2266667 C15.2933333,14.8933333 20.6266667,14.6266667 21.2666667,14.6266667 L21.2666667,18.6266667 L26.6666667,13.3333333 M11.5066667,14.12 C9.73750154,12.7546385 7.56807369,12.0096298 5.33333333,12 L5.33333333,8 L1.18423789e-15,13.3333333 L5.33333333,18.6666667 L5.33333333,14.6666667 C7.12,14.7066667 8.84,15.3333333 10.1866667,16.5333333 C10.52,15.68 10.96,14.8666667 11.5066667,14.12 Z"
                id="形状"
              ></path>
            </g>
          </g>
        </svg>
      </div>
    </Popover>
  );
};
