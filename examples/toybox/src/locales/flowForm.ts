import { GlobalRegistry } from '@toy-box/designable-core'

const zhCN = {
  'zh-CN': {
    toyboxStudio: {
      panels: {
        resource: '资源',
        flow: '流程节点',
        data: '数据',
        warn: '警告',
        error: '错误',
        debug: '调试',
        sources: {
          logical: '基础节点',
          data: '数据',
          action: '操作',
        },
      },
      resource: {
        create: '新建资源',
      },
      comm: {
        cancel: '取消',
        submit: '确定',
        remove: '删除',
      },
      errorMessage: {
        error: '个错误信息。',
        warn: '个警告信息。',
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
          httpCalls: 'http动作',
        },
        autoFlow: {
          variable: '变量',
          variableRecord: '记录（单个）变量',
          variableArray: '集合变量',
          variableArrayRecord: '集合记录变量',
          constant: '常量',
          formula: '公式',
          template: '模板',
        },
      },
    },
  },
}

const enUS = {
  'en-US': {
    toyboxStudio: {
      panels: {
        resource: 'Resource',
        element: 'Element',
        flow: 'Flow',
        data: 'Data',
        warn: 'Warn',
        error: 'Error',
        sources: {
          logical: 'Logical node',
          data: 'data',
          action: 'Action',
        },
        debug: 'Debug',
      },
      resource: {
        create: 'create resource',
      },
      comm: {
        cancel: 'cancel',
        submit: 'submit',
        remove: 'remove',
      },
      errorMessage: {
        error: 'Error Message',
        warn: 'Warn Message',
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
          httpCalls: 'httpCalls',
        },
        autoFlow: {
          variable: 'Variable',
          variableRecord: 'Variable Record',
          variableArray: 'Variable Array',
          variableArrayRecord: 'Variable Array Record',
          constant: 'Constant',
          formula: 'Formula',
          template: 'Template',
        },
      },
    },
  },
}

GlobalRegistry.registerDesignerLocales(zhCN, enUS)
