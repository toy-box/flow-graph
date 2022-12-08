import { FlowMetaType, IFlowMeta } from '@toy-box/autoflow-core'
import { IFlowNodeProps } from '@toy-box/flow-graph'

const BASE_SIZE = 30
const STAND_SIZE = BASE_SIZE * 2

export const flowData1: IFlowNodeProps[] = [
  {
    id: '000',
    type: 'begin',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'StartNode',
    targets: ['001'],
    data: {
      title: '开始',
    },
  },
  {
    id: '001',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002'],
  },
  {
    id: '002',
    type: 'end',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'EndNode',
    data: {
      title: '结束',
    },
  },
]

export const flowData2: IFlowNodeProps[] = [
  {
    id: '000',
    type: 'begin',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'StartNode',
    targets: ['001'],
    data: {
      title: '开始',
      description: '开始节点',
    },
  },
  {
    id: '001',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002'],
  },
  {
    id: '002',
    type: 'decisionBegin',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'DecisionNode',
    decisionEndTarget: '005',
    targets: [
      { id: '002-1', label: 'goto 002-1' },
      { id: '002-2', label: 'goto 002-2' },
    ],
    data: {
      title: '分支',
      description: '分支路线选择',
    },
  },
  {
    id: '002-1',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002-1-1'],
  },
  {
    id: '002-2',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002-2-2'],
  },
  {
    id: '002-1-1',
    type: 'forward',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'ActionNode',
    targets: ['002-1-2'],
  },
  {
    id: '002-1-2',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002-1-3'],
  },
  {
    id: '002-1-3',
    type: 'loopBegin',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'LoopNode',
    loopBackTarget: '002-3-2',
    loopEndTarget: '002-1-5',
    targets: ['002-1-4'],
  },
  {
    id: '002-1-4',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002-3'],
  },
  {
    id: '002-3',
    type: 'loopBegin',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'LoopNode',
    loopBackTarget: '002-3-1',
    loopEndTarget: '002-3-2',
    targets: ['002-3-1'],
  },
  {
    id: '002-3-1',
    type: 'forward',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'ExtendNode',
    targets: ['002-3-2'],
  },
  {
    id: '002-3-2',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['002-1-5'],
  },
  {
    id: '002-1-5',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['005'],
  },
  {
    id: '002-2-2',
    type: 'decisionBegin',
    width: STAND_SIZE,
    height: STAND_SIZE,
    decisionEndTarget: '004',
    component: 'DecisionNode',
    targets: [
      { id: '003-1', label: 'goto 003-1' },
      { id: '003-2', label: 'goto 003-2' },
      { id: '003-3', label: 'goto 003-3' },
    ],
  },
  {
    id: '003-1',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['003-1-1'],
  },
  {
    id: '003-2',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['003-2-2'],
  },
  {
    id: '003-3',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['003-3-3'],
  },
  {
    id: '003-1-1',
    type: 'forward',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'ActionNode',
    targets: ['003-1-2'],
  },
  {
    id: '003-1-2',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['004'],
  },
  {
    id: '003-2-2',
    type: 'forward',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'ActionNode',
    targets: ['003-2-2-2'],
  },
  {
    id: '003-3-3',
    type: 'forward',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'ActionNode',
    targets: ['003-3-3-3'],
  },
  {
    id: '003-2-2-2',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['004'],
  },
  {
    id: '003-3-3-3',
    type: 'forward',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['004'],
  },
  {
    id: '004',
    type: 'decisionEnd',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['005'],
  },
  {
    id: '005',
    type: 'decisionEnd',
    width: STAND_SIZE / 2,
    height: STAND_SIZE / 2,
    component: 'ExtendNode',
    targets: ['006'],
  },
  {
    id: '006',
    type: 'forward',
    width: STAND_SIZE,
    height: STAND_SIZE,
    component: 'ActionNode',
    data: {
      title: 'New Action',
      description: 'New Action',
    },
  },
]

export const flowMeta: IFlowMeta = {
  resources: {},
  nodes: {
    start: {
      id: 'start',
      name: 'Start',
      type: FlowMetaType.START,
      connector: {
        targetReference: 'end',
      },
    },
    end: {
      id: 'end',
      name: 'End',
      type: FlowMetaType.END,
    },
  },
}

export const freeMeta: IFlowMeta = {
  resources: {},
  nodes: {
    start: {
      id: 'start',
      name: 'Start',
      type: FlowMetaType.START,
      x: 300,
      y: 30,
      connector: {
        targetReference: '1123ssddd',
      },
    },
    decisions: [
      {
        id: '1123ssddd',
        name: 'Decision',
        type: FlowMetaType.DECISION,
        defaultConnector: { targetReference: 'assignment1' },
        defaultConnectorName: 'default',
        x: 300,
        y: 150,
        rules: [
          {
            id: 'rule1233',
            name: 'rule-1',
            connector: {
              // targetReference: 'assignment12'
            },
            criteria: {
              conditions: [],
              logic: '$and',
            },
          },
        ],
      },
      {
        id: 'decision1122',
        name: 'Decision',
        type: FlowMetaType.DECISION,
        defaultConnector: { targetReference: 'assignment12' },
        defaultConnectorName: 'default',
        x: 500,
        y: 250,
        rules: [
          {
            id: 'rule12331123',
            name: 'rule-2',
            connector: {
              // targetReference: 'assignment12'
            },
            criteria: {
              conditions: [],
              logic: '$and',
            },
          },
        ],
      },
    ],
    assignments: [
      {
        id: 'assignment1',
        name: 'Assignment',
        type: FlowMetaType.ASSIGNMENT,
        connector: {},
        x: 100,
        y: 180,
      },
      {
        id: 'assignment12323',
        name: 'Assignment12322',
        type: FlowMetaType.ASSIGNMENT,
        connector: {},
        x: 100,
        y: 400,
      },
      {
        id: 'assignment12',
        name: 'Assignment1',
        type: FlowMetaType.ASSIGNMENT,
        connector: { targetReference: 'assignment12323' },
        x: 300,
        y: 500,
      },
    ],
  },
}
