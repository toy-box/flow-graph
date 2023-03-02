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
        debug: '调试',
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
          httpCalls: '网络调用',
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
        metaType: {
          text: '大段文本',
          str: '文本',
          num: '数字',
          objectId: '记录',
          bool: '布尔值',
          date: '日期',
          dateTime: '时间',
          singleOption: '单选列表',
          multiOption: '多选列表',
        },
        metaValueType: {
          add: '添加',
          subtract: '减少',
          assign: '等于',
          addAtStart: '添加到第一个',
          removeFirst: '移除第一个',
          removeAll: '移除所有',
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
            result: '结果',
            operationTitle: '变量',
            typeTitle: '运算符',
            valueTitle: '值',
            operationPlace: '搜索资源',
            typePlace: '运算符',
            valuePlace: '输入值或搜索资源...',
            collectionPlace: '搜索集合变量...',
            deleteTitle: '删除',
            deleteDesc: '是否删除该元素节点?',
          },
          resourceCreate: {
            createTitle: '创建资源',
            editTitle: '编辑资源',
            flowType: '资源类型',
            name: '资源名称',
            description: '描述',
            type: '数据类型',
            valueType: '集合',
            valueTypeOption: {
              array: '允许多个值（集合）',
            },
            refObjectId: '对象',
            defaultValue: '默认值',
            text: '模板',
            expression: '公式',
            paramLabel: '在流外部可用',
            isInput: '可供输入',
            isOutPut: '可供输出',
          },
          validator: {
            filter: '筛选记录是必填项',
            label: '标题是必填项',
            value: 'API名称是必填项',
            apiLength: 'API名称长度不能超过32位',
            resourceRegRuleMessage: 'API名称仅可以包含下划线和字母数字字符',
            repeatName: 'API名称重复',
            flowType: '资源类型是必填项',
            type: '数据类型是必填项',
            required: '该字段是必填字段',
            registerId: '对象记录是必填项',
            field: '字段是必填项',
            recordIdValue: '记录是必填项',
          },
          placeholder: {
            assignRecordIdToReference: '请选择变量',
          },
          assignment: {
            addTitle: '新建分配',
            editTitle: '编辑分配',
            removeTitle: '删除分配',
            setVariable: '设置变量值',
            tip: '每个变量由运算符和值组合修改。',
            typeEquals: '等于',
            typeAdd: '添加',
          },
          decision: {
            addTitle: '新增决策',
            editTitle: '编辑决策',
            tagTitle: '结果顺序',
            tipTitle: '结果',
            tip: '对于流可以使用的每个路径，创建结果。对于每个结果，指定必须满足的条件，以便流使用该路径。',
            ruleTitle: '结果顺序',
            ruleLabel: '标签',
            ruleId: '结果 API 名称',
            logicTitle: '执行结果的条件要求',
            logicAnd: '满足所有条件 (AND)',
            logicOr: '满足任何条件 (OR)',
            logicCustom: '满足自定义条件逻辑',
            operationTitle: '资源',
            removeResult: '删除结果',
            defaultConnectorName: '默认结果',
          },
          loop: {
            addTitle: '新增循环',
            editTitle: '编辑循环',
            titleCollection: '指定循环访问集合的方向',
            collectionReference: '集合变量',
            titleDirection: '指定循环访问集合的方向',
            iterationPositive: '第一项到最后一项',
            iterationReverse: '最后一项到第一项',
            titleLoop: '选择循环变量',
            loopVariable: '循环变量',
            loopDescrip:
              '启动循环路径以循环访问集合变量中的项。对于每次迭代，流都会将项临时存储在循环变量中。',
          },
          deciConnect: {
            addTitle: '选择决策连接器的结果',
            extraConnectTip: '要转到 ',
            lastConnectTip: ' 元素，必须满足哪些结果条件？',
          },
          loopConnect: {
            addTitle: '选择循环连接器的结果',
            extraConnectTip: '指定何时转到 ',
            lastConnectTip: ' 元素',
            eachResult: '对于集合中的每个项目',
            lastResult: '对于集合中的最后一项',
          },
          recordCreate: {
            addTitle: '新建创建记录',
            editTitle: '编辑创建记录',
            removeTitle: '删除创建记录',
            setting: '设置',
            setField: '的字段值',
            saveId: '在变量中存储',
            registerId: '对象记录',
            inputAssignments: '设置字段值',
            storeOutputAutomatically: '手动分配变量',
            assignRecordIdToReference: '变量',
          },
          recordRemove: {
            addTitle: '新建删除记录',
            editTitle: '编辑删除记录',
            removeTitle: '删除记录',
            registerId: '对象记录',
            conditions: '筛选记录',
            field: '字段',
            filterTitle: '待删除记录的条件要求',
            addBtn: '添加条件',
          },
          recordUpdate: {
            addTitle: '新建更新记录',
            editTitle: '编辑更新记录',
            removeTitle: '删除更新记录',
            filter: '筛选',
            record: '记录',
            setting: '设置',
            setField: '的字段值',
            registerId: '对象记录',
            conditions: '筛选记录',
            inputAssignments: '设置字段值',
            field: '字段',
            filterTitle: '待删除记录的条件要求',
            addBtn: '添加条件',
          },
          recordLookUp: {
            addTitle: '新建获取记录',
            editTitle: '编辑获取记录',
            removeTitle: '删除获取记录',
            filter: '筛选',
            record: '记录',
            registerId: '对象记录',
            conditions: '筛选记录',
            sortOrder: '排序记录',
            sortOrderOption: {
              asc: '升序',
              desc: '降序',
              no: '未排序',
            },
            sortField: '排序标准',
            getFirstRecordOnly: '存储的记录数量',
            getFirstRecordOnlyOp: {
              first: '仅限第一个记录',
              all: '所有记录',
            },
            storeOutputAutomatically: '如何存储记录数据',
            storeOutputAutomaticallyOp: {
              auto: '自动存储所有字段',
              people: '手动存储所有字段',
            },
            automaticallyType: '手动存储类型',
            automaticallyTypeOp: {
              select: '选择字段',
              selectPro: '选择字段并分配变量（高级）',
            },
            address: '存储字段值的位置',
            addressOption: {
              comm: '共同在记录变量中',
              one: '在单独变量中',
            },
            outputReference: '记录变量',
            outputReferenceArray: '记录集合变量',
            outputReferenceLabel: '记录（单个）变量',
            queriedFields: '选择指定id字段',
            addField: '添加字段',
            outputAssignments: '设置字段',
            textTemplate: '如果您仅存储第一个记录，按唯一字段筛选，例如 ID。',
            assignNullValuesIfNoRecordsFound:
              '在未返回记录时，将指定变量设置为空',
          },
          httpCalls: {
            addTitle: '新建网络请求',
            editTitle: '编辑网络请求',
            urlTitle: '请求地址',
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
          httpCalls: 'httpCalls',
          end: 'end',
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
        metaType: {
          text: 'text',
          str: 'string',
          num: 'number',
          objectId: 'record',
          bool: 'boolean',
          date: 'date',
          dateTime: 'dateTime',
          singleOption: 'singleOption',
          multiOption: 'multiOption',
        },
        metaValueType: {
          add: 'Add',
          subtract: 'Reduce',
          assign: ' Equal',
          addAtStart: 'Add To First',
          removeFirst: 'Remove First',
          removeAll: 'Remove All',
        },
        form: {
          comm: {
            label: 'Title',
            value: 'API name',
            description: 'Description',
            cancel: 'cancel',
            submit: 'submit',
            empty: 'empty',
            reference: 'reference',
            input: 'input',
            result: 'Outcome',
            operationTitle: 'Variable',
            typeTitle: 'Operator',
            valueTitle: 'Value',
            operationPlace: 'Search Resources',
            typePlace: 'operator',
            valuePlace: 'Enter value or search resources...',
            collectionPlace: 'Search collection variables...',
            deleteTitle: 'Delete',
            deleteDesc: 'Whether to delete the element node?',
          },
          resourceCreate: {
            createTitle: 'Create Resource',
            editTitle: 'Edit Resource',
            flowType: 'Resource Type',
            name: 'Resource Name',
            description: 'Description',
            type: 'Data Type',
            valueType: 'Collection',
            valueTypeOption: {
              array: 'Allow Multiple Values (Collection)',
            },
            refObjectId: 'Object',
            defaultValue: 'Default Value',
            text: 'Template',
            expression: 'Expression',
            paramLabel: 'Available Outside The Flow',
            isInput: 'Available Input',
            isOutPut: 'Available OutPut',
          },
          validator: {
            filter: 'filtering record is required',
            label: 'title is required',
            value: 'API name is required',
            apiLength: 'API name length cannot exceed 32 bits',
            resourceRegRuleMessage:
              'API name can only contain underscore and alphanumeric characters',
            repeatName: 'API name repeat',
            flowType: 'Resource Type is required',
            type: 'Data Type is required',
            required: 'This field is required',
            registerId: 'Object Record is required',
            field: 'This field is required',
            recordIdValue: 'Record is required',
          },
          placeholder: {
            assignRecordIdToReference: 'Select Variable',
          },
          assignment: {
            addTitle: 'New Assignment',
            editTitle: 'Edit Assignment',
            removeTitle: 'delete assignment',
            setVariable: 'Set variable value',
            tip: 'Each variable is modified by a combination of operators and values.',
            typeEquals: 'Equals',
            typeAdd: 'Add',
          },
          decision: {
            addTitle: 'New Decision',
            editTitle: 'Edit Decision',
            tagTitle: 'Outcome Order',
            tipTitle: 'Outcomes',
            tip: 'For each path the flow can take, create an outcome. For each outcome, specify the conditions that must be met for the flow to take that path.',
            ruleTitle: 'Outcome Order',
            ruleLabel: 'Label',
            ruleId: 'Outcome API Name',
            logicTitle: 'Condition Requirements to Execute Outcome',
            logicAnd: 'All Conditions Are Met (AND)',
            logicOr: 'Any Condition Is Met (OR)',
            logicCustom: 'Custom Condition Logic Is Met',
            operationTitle: 'Resource',
            removeResult: 'Remove Result',
            defaultConnectorName: 'defaultName',
          },
          loop: {
            addTitle: 'New Loop',
            editTitle: 'Edit Loop',
            titleCollection: 'Specify Direction for Iterating Over Collection',
            collectionReference: 'Collection Variable',
            titleDirection: 'Specify Direction for Iterating Over Collection',
            iterationPositive: 'First item to last item',
            iterationReverse: 'Last item to first item',
            titleLoop: 'Select Loop Variable',
            loopVariable: 'Loop Variable',
            loopDescrip:
              'Start a loop path for iterating over items in a collection variable. For each iteration, the flow temporarily stores the item in the loop variable.',
          },
          deciConnect: {
            addTitle: 'Select outcome for decision connector',
            extraConnectTip: 'To go to the ',
            lastConnectTip: ' element, which outcome’s conditions must be met?',
          },
          loopConnect: {
            addTitle: 'Select loop connector',
            extraConnectTip: 'Specify when to go to the ',
            lastConnectTip: ' element.',
            eachResult: 'For each item in the collection',
            lastResult: 'After Last item in the collection',
          },
          recordCreate: {
            addTitle: 'New CreateRecord',
            editTitle: 'Edit CreateRecord',
            removeTitle: 'Delete Create Record',
            setting: 'Set',
            setField: 'Field Value',
            saveId: 'Store In Variables',
            registerId: 'Object Record',
            inputAssignments: 'Set Field Value',
            storeOutputAutomatically: 'Manually Assign Variables',
            assignRecordIdToReference: 'Variable',
          },
          recordRemove: {
            addTitle: 'New DeleteRecord',
            editTitle: 'Edit DeleteRecord',
            removeTitle: 'Delete Record',
            registerId: 'Object Record',
            conditions: 'Filter Record',
            field: 'field',
            filterTitle: 'Delete Record Filter Condition',
            addBtn: 'Add Filter',
          },
          recordUpdate: {
            addTitle: 'New UpdateRecord',
            editTitle: 'Edit UpdateRecord',
            removeTitle: 'Delete UpdateRecord',
            filter: 'Filter',
            record: 'Record',
            setting: 'Set',
            setField: 'Field Value',
            registerId: 'Object Record',
            conditions: 'Filter Record',
            inputAssignments: 'Set Field Value',
            field: 'field',
            filterTitle: 'Delete Record Filter Condition',
            addBtn: 'Add Filter',
          },
          recordLookUp: {
            addTitle: 'New LookUpRecord',
            editTitle: 'Edit LookUpRecord',
            removeTitle: 'Delete LookUpRecord',
            filter: 'filter',
            record: 'record',
            registerId: 'Object Record',
            conditions: 'Filter Record',
            sortOrder: 'Sort Record',
            sortOrderOption: {
              asc: 'Asc',
              desc: 'Desc',
              no: 'No Sort',
            },
            sortField: 'Sort Standard',
            getFirstRecordOnly: 'Number of records stored',
            getFirstRecordOnlyOp: {
              first: 'First Record Only',
              all: 'All Record',
            },
            storeOutputAutomatically: 'How To Store Record Data',
            storeOutputAutomaticallyOp: {
              auto: 'Automatically Store All Fields',
              people: 'Manually Store All Fields',
            },
            automaticallyType: 'Manual Storage Type',
            automaticallyTypeOp: {
              select: 'Select Field',
              selectPro: 'Select Fields And Assign Variables (Advanced)',
            },
            address: 'Where To Store Field Values',
            addressOption: {
              comm: 'Common In Record Variables',
              one: 'In Separate Variables',
            },
            outputReference: 'Record Variable',
            outputReferenceArray: 'Record Set Variable',
            outputReferenceLabel: 'Record (single) variable',
            queriedFields: 'Select the specified id field',
            addField: 'Add Field',
            outputAssignments: 'Set Field',
            textTemplate:
              'If you only store the first record, filter by unique fields, such as ID.',
            assignNullValuesIfNoRecordsFound:
              'Set the specified variable to null when no record is returned',
          },
          httpCalls: {
            addTitle: 'New HttpCalls',
            editTitle: 'Edit HttpCalls',
            urlTitle: 'Url',
            methodTitle: 'Method',
            contentTypeTitle: 'contentType',
          },
        },
      },
    },
  },
}

GlobalRegistry.registerDesignerLocales(zhCN, enUS)
