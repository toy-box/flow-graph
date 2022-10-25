import React from 'react';
import classNames from 'classnames';
import { ICustomEvent } from '../shared';

import './styles';
import { Popover } from 'antd';
import { useEvent } from '../hooks';
import { FlowNode } from '../models';
import { NodePanel } from '../node-panel';

export interface IStandardNodeProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  data?: INodeDataProps;
}

interface INodeDataProps {
  title?: string;
  description?: string;
}

export const StandardNode: React.FC<
  React.PropsWithChildren<IStandardNodeProps>
> = ({ id, className, style, data = {}, children }) => {
  const eventEngine = useEvent();
  const prefixCls = 'tbox-flow-node';
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = eventEngine.subscribe((payload: ICustomEvent) => {
      if (payload.type === 'clickPane') {
        setActive(false);
      } else if (payload.type === 'clickNode') {
        if ((payload as ICustomEvent<FlowNode>).data?.id !== id) {
          setActive(false);
        }
      }
    });
    return unsubscribe();
  }, []);

  const closeExtend = () => {
    setActive(false);
  };

  const { title, description } = data;
  return (
    <Popover
      visible={active}
      trigger="click"
      onVisibleChange={(visible) => setActive(visible)}
      placement="bottom"
      content={<NodePanel closeExtend={closeExtend} nodeId={id} />}
      overlayClassName="no-padding"
    >
      <div className={classNames(prefixCls, className)} style={style}>
        <div className={`${prefixCls}__label`}>
          <div className="title">{title ?? id}</div>
          <div className="description">{description}</div>
        </div>
        {children}
      </div>
    </Popover>
  );
};
