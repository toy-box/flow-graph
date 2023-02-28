import { FreeFlow, MetaFlow } from '@toy-box/autoflow-core'

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
