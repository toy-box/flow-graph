import React from 'react';
import { Space, Button, Radio } from 'antd';
import { TextWidget } from '@designable/react';
import { GlobalRegistry } from '@designable/core';
import { observer } from '@formily/react';

export const ActionsWidget = observer(() => (
  <Space style={{ marginRight: 10 }}>
    <Radio.Group
      value={GlobalRegistry.getDesignerLanguage()}
      optionType="button"
      options={[
        { label: 'Engligh', value: 'en-US' },
        { label: '简体中文', value: 'zh-CN' },
      ]}
      onChange={(e) => {
        GlobalRegistry.setDesignerLanguage(e.target.value);
      }}
    />
    {GlobalRegistry.getDesignerLanguage()}
    <Button type="primary">
      <TextWidget>Publish</TextWidget>
    </Button>
  </Space>
));
