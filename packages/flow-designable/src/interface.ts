import {
  FlowMetaParam,
  FlowResourceType,
  FreeFlow,
  IFieldMetaResource,
  IRecordObject,
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
  getShortCuts: () => Promise<any>
}

export type AutoFlow = FreeFlow | MetaFlow

export interface IResourceMetaflow {
  metaResourceDatas: IResourceParam[]
  registers: any[]
  recordObject: IRecordObject
  metaFlowDatas: FlowMetaParam[]
  shortCutDatas: FlowMetaParam[]
  createResource: (type: FlowResourceType, resource: IFieldMetaResource) => void
  editResource: (type: FlowResourceType, resource: IFieldMetaResource) => void
}

export enum RegisterOpTypeEnum {
  CREATABLE = 'creatable',
  FILTERABLE = 'filterable',
  UPDATABLE = 'updatable',
}

export const apiReg = /^[A-Za-z][A-Za-z0-9_]*(\[[0-9]+\]|[A-Za-z0-9]*)$/
