import {
  FlowMetaParam,
  FlowResourceType,
  FreeFlow,
  IFieldMetaResource,
  IResourceParam,
  MetaFlow,
} from '@toy-box/autoflow-core'

export enum AssignmentOpEnum {
  ADD = 'Add',
  SUBTRACT = 'Subtract',
  ASSIGN = 'Assign',
  ADD_AT_START = 'AddAtStart',
  REMOVE_FIRST = 'RemoveFirst',
  REMOVE_ALL = 'RemoveAll',
}

export interface MetaService {
  getMetaObjectData: (value?: string) => Promise<any>
}

export type AutoFlow = FreeFlow | MetaFlow

export interface IResourceMetaflow {
  metaResourceDatas: IResourceParam[]
  registers: any[]
  metaFlowDatas: FlowMetaParam[]
  shortcutData: FlowMetaParam[]
  createResource: (type: FlowResourceType, resource: IFieldMetaResource) => void
  editResource: (type: FlowResourceType, resource: IFieldMetaResource) => void
}
