import { INodeTemplate, TargetType, uid } from '@toy-box/flow-graph'

export const nodes: INodeTemplate[] = [
  {
    icon: 'flow',
    title: 'Action',
    description: 'Action node',
    group: 'flow',
    make: (at: string, targets: TargetType[]) => {
      const newExtendId = uid()
      return {
        addNodesAt: [
          {
            id: at,
            node: {
              type: 'forward',
              width: 60,
              height: 60,
              component: 'ActionNode',
              data: {
                title: 'New Node',
                description: 'new node added',
              },
              targets: [newExtendId],
            },
          },
        ],
        addNodes: [
          {
            id: newExtendId,
            type: 'extend',
            width: 30,
            height: 30,
            component: 'ExtendNode',
            targets,
          },
        ],
      }
    },
  },
  {
    icon: 'flow',
    title: 'Loop',
    description: 'Loop node',
    group: 'flow',
    make: (at: string, targets: TargetType[]) => {
      const loopBackTarget = uid()
      const loopEndTarget = uid()
      return {
        addNodesAt: [
          {
            id: at,
            node: {
              type: 'loopBegin',
              width: 60,
              height: 60,
              component: 'LoopNode',
              loopBackTarget,
              loopEndTarget,
              data: {
                title: 'Loop Node',
              },
              targets: [loopBackTarget],
            },
          },
        ],
        addNodes: [
          {
            id: loopBackTarget,
            type: 'forward',
            width: 30,
            height: 30,
            component: 'ExtendNode',
            targets: [loopEndTarget],
          },
          {
            id: loopEndTarget,
            type: 'forward',
            width: 30,
            height: 30,
            component: 'ExtendNode',
            targets,
          },
        ],
      }
    },
  },
  {
    icon: 'flow',
    title: 'Decision',
    description: 'Decision node',
    group: 'flow',
    make: (at: string, targets: TargetType[]) => {
      const endId = uid()
      const condition1 = uid()
      const condition2 = uid()
      return {
        addNodesAt: [
          {
            id: at,
            node: {
              type: 'decisionBegin',
              width: 60,
              height: 60,
              component: 'DecisionNode',
              decisionEndTarget: endId,
              targets: [
                { id: condition1, label: 'condition1' },
                { id: condition2, label: 'condition2' },
              ],
            },
          },
        ],
        addNodes: [
          {
            id: condition1,
            type: 'forward',
            width: 30,
            height: 30,
            component: 'ExtendNode',
            targets: [endId],
          },
          {
            id: condition2,
            type: 'forward',
            width: 30,
            height: 30,
            component: 'ExtendNode',
            targets: [endId],
          },
          {
            id: endId,
            type: 'decisionEnd',
            width: 30,
            height: 30,
            component: 'ExtendNode',
            targets: targets,
          },
        ],
      }
    },
  },
]
