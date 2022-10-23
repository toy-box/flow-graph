import { IFlowNodeTemplate } from '@toy-box/flow-graph/src';

export const nodes: IFlowNodeTemplate[] = [
  {
    icon: 'flow',
    title: '循环',
    description: '循环便利数组',
    group: 'flow',
  },
  {
    icon: 'fork',
    title: '决策分支',
    description: '按条件情况决策分支',
    group: 'flow',
  },
  {
    icon: 'flow',
    title: '发送邮件',
    description: '发送电子邮件到指定地址',
    group: 'action',
  },
  {
    icon: 'flow',
    title: '交易',
    description: '执行交易',
    group: 'action',
  },
];
