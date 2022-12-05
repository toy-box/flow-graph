import { INodeTemplate, NodeMake, INodeEdit } from '@toy-box/flow-node'
import { FlowMetaType, MetaFlow, FreeFLow } from '@toy-box/autoflow-core'
import { uid } from '@toy-box/toybox-shared'
export const nodeTemplatesProvider = (
  metaFlow: MetaFlow,
  freeFlow: FreeFLow
): INodeTemplate<NodeMake>[] => {
  const appendOrAddNode = (at, flowData) => {
    if (at === 'freeLayout') {
      // freeFlow.appendNode(at, flowData)
      freeFlow.addNode(flowData)
    } else {
      metaFlow.appendNode(at, flowData)
      metaFlow.flow.layoutFlow()
    }
  }
  return [
    {
      icon: 'flow',
      title: 'Assignment',
      description: 'Assignment node',
      group: 'flow',
      make: (at: string, editInfo: INodeEdit, flowType?: FlowType) => {
        const flowData = {
          id: uid(),
          name: 'Assignment',
          type: FlowMetaType.ASSIGNMENT,
          connector: {},
          ...editInfo,
        }
        appendOrAddNode(at, flowData, flowType)
      },
    },
    {
      icon: 'flow',
      title: 'Loop',
      description: 'Loop node',
      group: 'flow',
      make: (at: string, editInfo: INodeEdit) => {
        const flowData = {
          id: uid(),
          name: 'Loop',
          type: FlowMetaType.LOOP,
          defaultConnector: { targetReference: '' },
          ...editInfo,
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'Decision',
      description: 'Decision node',
      group: 'flow',
      make: (at: string, editInfo: INodeEdit) => {
        const flowData = {
          id: uid(),
          name: 'Decision',
          type: FlowMetaType.DECISION,
          defaultConnector: { targetReference: '' },
          rules: [
            {
              id: uid(),
              name: 'rule-1',
              connector: {},
              criteria: {
                conditions: [],
                logic: '$and',
              },
            },
          ],
          ...editInfo,
        }
        appendOrAddNode(at, flowData)
      },
    },
    // {
    //   icon: 'flow',
    //   title: 'Decision',
    //   description: 'Decision node',
    //   group: 'flow',
    //   make: (at: string, targets: TargetType[]) => {
    //     const endId = uid()
    //     const condition1 = uid()
    //     const condition2 = uid()
    //     return {
    //       addNodesAt: [
    //         {
    //           id: at,
    //           node: {
    //             type: 'decisionBegin',
    //             width: 60,
    //             height: 60,
    //             component: 'DecisionNode',
    //             decisionEndTarget: endId,
    //             targets: [
    //               { id: condition1, label: 'condition1' },
    //               { id: condition2, label: 'condition2' },
    //             ],
    //           },
    //         },
    //       ],
    //       addNodes: [
    //         {
    //           id: condition1,
    //           type: 'forward',
    //           width: 30,
    //           height: 30,
    //           component: 'ExtendNode',
    //           targets: [endId],
    //         },
    //         {
    //           id: condition2,
    //           type: 'forward',
    //           width: 30,
    //           height: 30,
    //           component: 'ExtendNode',
    //           targets: [endId],
    //         },
    //         {
    //           id: endId,
    //           type: 'decisionEnd',
    //           width: 30,
    //           height: 30,
    //           component: 'ExtendNode',
    //           targets: targets,
    //         },
    //       ],
    //     }
    //   },
    // },
  ]
}

// export const nodes: INodeTemplate[] = [
//   {
//     icon: 'flow',
//     title: 'Action',
//     description: 'Action node',
//     group: 'flow',
//     make: (at: string, targets: TargetType[]) => {
//       const newExtendId = uid()
//       return {
//         addNodesAt: [
//           {
//             id: at,
//             node: {
//               type: 'forward',
//               width: 60,
//               height: 60,
//               component: 'ActionNode',
//               data: {
//                 title: 'New Node',
//                 description: 'new node added',
//               },
//               targets: [newExtendId],
//             },
//           },
//         ],
//         addNodes: [
//           {
//             id: newExtendId,
//             type: 'extend',
//             width: 30,
//             height: 30,
//             component: 'ExtendNode',
//             targets,
//           },
//         ],
//       }
//     },
//   },
//   {
//     icon: 'flow',
//     title: 'Loop',
//     description: 'Loop node',
//     group: 'flow',
//     make: (at: string, targets: TargetType[]) => {
//       const loopBackTarget = uid()
//       const loopEndTarget = uid()
//       return {
//         addNodesAt: [
//           {
//             id: at,
//             node: {
//               type: 'loopBegin',
//               width: 60,
//               height: 60,
//               component: 'LoopNode',
//               loopBackTarget,
//               loopEndTarget,
//               data: {
//                 title: 'Loop Node',
//               },
//               targets: [loopBackTarget],
//             },
//           },
//         ],
//         addNodes: [
//           {
//             id: loopBackTarget,
//             type: 'forward',
//             width: 30,
//             height: 30,
//             component: 'ExtendNode',
//             targets: [loopEndTarget],
//           },
//           {
//             id: loopEndTarget,
//             type: 'forward',
//             width: 30,
//             height: 30,
//             component: 'ExtendNode',
//             targets,
//           },
//         ],
//       }
//     },
//   },
//   {
//     icon: 'flow',
//     title: 'Decision',
//     description: 'Decision node',
//     group: 'flow',
//     make: (at: string, targets: TargetType[]) => {
//       const endId = uid()
//       const condition1 = uid()
//       const condition2 = uid()
//       return {
//         addNodesAt: [
//           {
//             id: at,
//             node: {
//               type: 'decisionBegin',
//               width: 60,
//               height: 60,
//               component: 'DecisionNode',
//               decisionEndTarget: endId,
//               targets: [
//                 { id: condition1, label: 'condition1' },
//                 { id: condition2, label: 'condition2' },
//               ],
//             },
//           },
//         ],
//         addNodes: [
//           {
//             id: condition1,
//             type: 'forward',
//             width: 30,
//             height: 30,
//             component: 'ExtendNode',
//             targets: [endId],
//           },
//           {
//             id: condition2,
//             type: 'forward',
//             width: 30,
//             height: 30,
//             component: 'ExtendNode',
//             targets: [endId],
//           },
//           {
//             id: endId,
//             type: 'decisionEnd',
//             width: 30,
//             height: 30,
//             component: 'ExtendNode',
//             targets: targets,
//           },
//         ],
//       }
//     },
//   },
// ]
