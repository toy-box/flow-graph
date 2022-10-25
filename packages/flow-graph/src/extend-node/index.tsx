import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { INodeProps } from '../types';
import { ExtendPanel } from '../extend-panel';
import { useEvent } from '../hooks';
import { ICustomEvent } from '../shared';
import { FlowNode } from '../models';
import './styles';

export const ExtendNode: FC<React.PropsWithChildren<INodeProps>> = (props) => {
  const eventEngine = useEvent();
  const [active, setActive] = useState(false);
  React.useEffect(() => {
    const unsubscribe = eventEngine.subscribe((payload: ICustomEvent) => {
      if (payload.type === 'clickPane') {
        setActive(false);
      } else if (payload.type === 'clickNode') {
        if ((payload as ICustomEvent<FlowNode>).data?.id !== props.id) {
          setActive(false);
        }
      }
    });
    return unsubscribe();
  }, []);
  const handleOpenChange = (state: boolean) => {
    setActive(state);
  };
  const closeExtend = () => {
    setActive(false);
  };

  const renderContent = () => {
    return <ExtendPanel closeExtend={closeExtend} node={props} />;
  };

  return (
    <div className={classNames('tbox-flow-extend-node', { active })}>
      <Popover
        visible={active}
        trigger="click"
        onVisibleChange={(visible) => setActive(visible)}
        placement="bottom"
        content={renderContent()}
        overlayClassName="no-padding"
      >
        <button onClick={() => handleOpenChange(!active)}>
          <PlusOutlined />
        </button>
      </Popover>
    </div>
  );
};
