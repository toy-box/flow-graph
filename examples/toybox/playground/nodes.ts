import { INodeTemplate, NodeMake, INodeEdit } from '@toy-box/flow-node'
import {
  FlowMetaType,
  MetaFlow,
  FreeFlow,
  FlowMetaParam,
} from '@toy-box/autoflow-core'
import { uid } from '@toy-box/toybox-shared'

const createLocationInfo = (info) => {
  return {
    x: info.x - 220,
    y: info.y - 47,
  }
}
export const nodeTemplatesProvider = (
  metaFlow: MetaFlow,
  freeFlow: FreeFlow
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
  const shortcutNodes =
    freeFlow &&
    freeFlow.shortCutDatas.length &&
    freeFlow.shortCutDatas.map((item: FlowMetaParam) => {
      return {
        icon: 'flow',
        title: 'ShortCut',
        description: item.description ?? 'ShortCut',
        type: FlowMetaType.SHORT_CUT,
        group: 'flow',
        metaFlow: freeFlow,
        make: (at: string, editInfo: INodeEdit) => {
          const info = createLocationInfo(editInfo)
          const flowData = {
            name: item.name ?? 'ShortCut',
            type: FlowMetaType.SHORT_CUT,
            connector: { targetReference: '' },
            ...Object.assign(editInfo, info),
          }
          appendOrAddNode(at, flowData)
        },
      }
    })
  return [
    {
      icon: 'flow',
      title: 'Assignment',
      description: 'Assignment node',
      type: FlowMetaType.ASSIGNMENT,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'Assignment',
          type: FlowMetaType.ASSIGNMENT,
          connector: {},
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'Loop',
      description: 'Loop node',
      type: FlowMetaType.LOOP,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'Loop',
          type: FlowMetaType.LOOP,
          defaultConnector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'Decision',
      description: 'Decision node',
      type: FlowMetaType.DECISION,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
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
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'Wait',
      description: 'Wait',
      type: FlowMetaType.WAIT,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'Wait',
          type: FlowMetaType.WAIT,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'Sort',
      description: 'Collection Sort',
      type: FlowMetaType.SORT_COLLECTION_PROCESSOR,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'Sort',
          type: FlowMetaType.SORT_COLLECTION_PROCESSOR,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'RecordCreate',
      description: 'Create Records',
      type: FlowMetaType.RECORD_CREATE,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'RecordCreate',
          type: FlowMetaType.RECORD_CREATE,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'RecordUpdate',
      description: 'Update Records',
      type: FlowMetaType.RECORD_UPDATE,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'RecordUpdate',
          type: FlowMetaType.RECORD_UPDATE,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'RecordDelete',
      description: 'Delete Records',
      type: FlowMetaType.RECORD_DELETE,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'RecordDelete',
          type: FlowMetaType.RECORD_DELETE,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'RecordLookup',
      description: 'Lookup Records',
      type: FlowMetaType.RECORD_LOOKUP,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'RecordLookup',
          type: FlowMetaType.RECORD_LOOKUP,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'HttpCalls',
      description: 'HttpCalls',
      type: FlowMetaType.HTTP_CALL,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'HttpCalls',
          type: FlowMetaType.HTTP_CALL,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    {
      icon: 'flow',
      title: 'Shortcut',
      description: 'Shortcut',
      type: FlowMetaType.SHORT_CUT,
      group: 'flow',
      metaFlow: freeFlow,
      make: (at: string, editInfo: INodeEdit) => {
        const info = createLocationInfo(editInfo)
        const flowData = {
          name: 'Shortcut',
          type: FlowMetaType.SHORT_CUT,
          connector: { targetReference: '' },
          ...Object.assign(editInfo, info),
        }
        appendOrAddNode(at, flowData)
      },
    },
    // ...shortcutNodes
    // {
    //   icon: 'flow',
    //   title: 'ShortCut',
    //   description: 'ShortCut',
    //   type: FlowMetaType.SHORTCUT,
    //   group: 'flow',
    //   metaFlow: freeFlow,
    //   make: (at: string, editInfo: INodeEdit) => {
    //     const flowData = {
    //       name: 'ShortCut',
    //       type: FlowMetaType.SHORTCUT,
    //       connector: { targetReference: '' },
    //       ...Object.assign(editInfo, info),,
    //     }
    //     appendOrAddNode(at, flowData)
    //   },
    // }
  ]
}
