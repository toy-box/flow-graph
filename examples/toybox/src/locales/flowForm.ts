import { GlobalRegistry } from '@toy-box/designable-core'

const zhCN = {
  'zh-CN': {
    flowDesigner: {
      panels: {
        resource: '资源',
        flow: '流程节点',
        data: '数据',
        warn: '警告',
        error: '错误',
      },
      flow: {
        extend: {
          title: '添加流程节点',
          assign: '分配',
          decision: '决策',
          suppend: '暂停',
          loop: '循环',
          collection: '排序',
          recordCreate: '创建记录',
          recordUpdate: '更新记录',
          recordLookup: '查询记录',
          recordDelete: '删除记录',
        },
        form: {
          comm: {
            label: '标题',
            value: 'API名称',
            description: '描述',
            cancel: '取消',
            submit: '确定',
            empty: '暂无数据',
            reference: '引用变量',
            input: '直接输入',
          },
        },
      },
    },
  },
}

const enUS = {
  'en-US': {
    flowDesigner: {
      panels: {
        resource: 'Resource',
        element: 'Element',
        flow: 'Flow',
        data: 'Data',
        warn: 'Warn',
        error: 'Error',
        sources: {
          logical: 'Logical node',
        },
      },
      flow: {
        extend: {
          title: 'title',
          start: 'start',
          assign: 'assign',
          decision: 'decision',
          suppend: 'wait',
          loop: 'loop',
          collection: 'collection',
          recordCreate: 'recordCreate',
          recordUpdate: 'recordUpdate',
          recordLookup: 'recordLookup',
          recordDelete: 'recordDelete',
          end: 'end',
        },
        form: {
          comm: {
            label: 'title',
            value: 'API',
            description: 'description',
            cancel: 'cancel',
            submit: 'submit',
            empty: 'empty',
            reference: 'reference',
            input: 'input',
          },
        },
      },
    },
  },
}

GlobalRegistry.registerDesignerLocales(zhCN, enUS)
