import { raw } from '@formily/reactive'
import { IFieldMeta } from '@toy-box/meta-schema'

export type AnyFunction = (...args: any[]) => any

export interface MetaFlowInstance {
  id: string
  name: string
  flow: IFlowMeta
}

export enum LifeCycleTypes {
  ON_FLOW_GRAPH_INIT = 'onFlowGraphInit',
  ON_FLOW_GRAPH_INIT_CHANGE = 'onFlowGraphInitChange',

  ON_FLOW_GRAPH_MOUNT = 'onFlowGraphMount',
  ON_FLOW_GRAPH_UMOUNT = 'onFlowGraphUnmount',

  ON_FLOW_GRAPH_EDITABLE = 'onFlowGraphEditable',

  ON_PROCESS_DRAGING = 'onProcessDraging',
  ON_PROCESS_DROPING = 'onProcessDroping',

  ON_NODE_CHANGE = 'onNodeChange',

  ON_FLOW_ADD_START = 'onFlowAddStart',
  ON_FLOW_ADD_END = 'onFlowAddEnd',
  ON_FLOW_REMOVE_START = 'onFlowRemoveStart',
  ON_FLOW_REMOVE_END = 'onFlowRemoveENd',
}

export type LifeCycleHandler<T> = (payload: T, context: any) => void

export type LifeCyclePayload<T> = (
  params: {
    type: string
    payload: T
  },
  context: any
) => void

export enum FlowResourceType {
  VARIABLE = 'variables',
  VARIABLE_RECORD = 'variables_record',
  VARIABLE_ARRAY = 'variables_array',
  VARIABLE_ARRAY_RECORD = 'variables_array_record',
  CONSTANT = 'constants',
  FORMULA = 'formulas',
  TEMPLATE = 'templates',
}

export interface IFlowMetaResource {
  [FlowResourceType.VARIABLE]?: IFieldMeta[]
  [FlowResourceType.CONSTANT]?: IFieldMeta[]
  [FlowResourceType.FORMULA]?: IFieldMeta[]
  [FlowResourceType.TEMPLATE]?: IFieldMeta[]
}

export interface VariableParam {
  type: 'string'
}

export interface IFlowMetaNodes {
  start?: FlowMetaParam
  end?: FlowMetaParam
  assignments?: FlowMetaParam[]
  decisions?: FlowMetaParam[]
  waits?: FlowMetaParam[]
  loops?: FlowMetaParam[]
  recordCreates?: FlowMetaParam[]
  recordDeletes?: FlowMetaParam[]
  recordUpdates?: FlowMetaParam[]
  recordLookups?: FlowMetaParam[]
  httpCalls?: FlowMetaParam[]
}
export interface IFlowMeta {
  resources: IFlowMetaResource
  nodes: IFlowMetaNodes
}

export enum FlowMetaType {
  START = 'start',
  ASSIGNMENT = 'assignments',
  DECISION = 'decisions',
  WAIT = 'waits',
  LOOP = 'loops',
  SORT_COLLECTION_PROCESSOR = 'sortCollectionProcessor',
  RECORD_CREATE = 'recordCreates',
  RECORD_UPDATE = 'recordUpdates',
  RECORD_DELETE = 'recordDeletes',
  RECORD_LOOKUP = 'recordLookups',
  HTTP_CALLS = 'httpCalls',
  SHORTCUT = 'shortcut',
  END = 'end',
}

export interface IFlowMetaDecisionRule {
  id: string
  name: string
  description?: string
  criteria: Criteria
  connector: TargetReference
}

export type FlowMetaUpdate = Omit<
  FlowMetaParam,
  // | 'id'
  | 'type'
  | 'connector'
  | 'defaultConnector'
  | 'faultConnector'
  | 'nextValueConnector'
>
export interface FlowMetaParam {
  id: string
  name: string
  description?: string
  type: FlowMetaType
  connector?: TargetReference
  defaultConnector?: TargetReference // 决策默认分支，循环跳出循环分支
  faultConnector?: TargetReference // 异常分支
  nextValueConnector?: TargetReference // 循环内循环分支
  defaultConnectorName?: string
  assignmentItems?: IAssignmentData[]
  rules?: IFlowMetaDecisionRule[]
  collectionReference?: string
  iterationOrder?: string
  limit?: null | number
  sortOptions?: SortOption[]
  registerId?: string
  inputAssignments?: IInputAssignment[]
  storeOutputAutomatically?: boolean
  assignRecordIdToReference?: string
  criteria?: Criteria | null
  outputAssignments?: IOutputAssignment[]
  outputReference?: null | string
  queriedFields?: string[]
  sortOrder?: SortOrder
  sortField?: string
  getFirstRecordOnly?: boolean
  waitEvents?: IwaitEvent[]
  result?: string
  callArguments?: ICallArgumentData
  shortcutJson?: IShortcutJsonData
  shortcutId?: string

  variable?: Record<string, VariableParam>
  x?: number
  y?: number
}

export interface FlowMetaParamWithSize extends FlowMetaParam {
  width?: number
  height?: number
}

export type StartFlowMetaUpdate = Omit<IStartFlowMeta, 'id' | 'connector'>

export interface IStartFlowMeta {
  id: string
  name: string
  description?: string
  connector?: TargetReference
  criteria?: Criteria | null
  objectId?: string
  recordTriggerType?: RecordTriggerTypeEnum
  schedule?: ISchedule
  triggerType?: TriggerTypeEnum
  flowType: FlowType
}

export interface IwaitEvent {
  connector: TargetReference
  outputParameters?: IOutParameter[]
  id: string
  name: string
  criteria?: Criteria | null
  eventType: string
  recoveryTimeInfo: IRecoveryTimeInfo
}

export interface IRecoveryTimeInfo {
  dateValue: string
  dateValueType: string
  field: string
  offsetNum?: number
  offsetUnit?: string
  recordIdType: string
  recordIdValue: string
  registerId: string
}

export interface SortOption {
  sortField: null | string
  sortOrder: SortOrder
  doesPutEmptyStringAndNullFirst: boolean
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NULL = 'null',
}

export interface TargetReference {
  targetReference?: string | null
}

export interface ConnectorProps {
  targetReference?: string[]
  sourceReference?: string[]
}

export interface Criteria {
  conditions: Partial<ICriteriaCondition>[]
  logic: string
}

export type FlowNodeComm = {
  id: string
  label: string
  type: FlowMetaType
}

export enum OpartType {
  EDIT = 'edit',
  REMOVE = 'remove',
}

export interface IInputAssignment {
  field: string
  type: string
  value: any
}

export interface IOutParameter {
  id: string
  type?: string
  value?: any
}

export interface ICriteriaCondition {
  fieldPattern: string
  operation: string
  type: string
  value: any
}

export interface IAssignmentData {
  assignToReference: string
  operation: string
  type: string
  value: any
}

export interface IOutputAssignment {
  assignToReference: string
  field: string
}

export interface IFieldMetaFlow extends IFieldMeta {
  webType?: string
  flowMetaType?: FlowMetaType
  isInput?: boolean
  isOutPut?: boolean
}

export type IUpdateFieldMetaVariable = Pick<
  IFieldMetaFlow,
  'name' | 'defaultValue' | 'description' | 'isInput' | 'isOutPut'
>

export type FlowType =
  | 'AUTO_START_UP'
  | 'PLAN_TRIGGER'
  | 'PLATFORM_EVENT'
  | 'RECORD_TRIGGER'
  | 'SCREEN'

export type LayoutType = 'AUTO_START_UP' | 'FREE_START_UP'

export interface ISchedule {
  frequency: string
  startDate: string
  startTime: string
}

export enum TriggerTypeEnum {
  RECORD_AFTER_SAVE = 'recordAfterSave',
  RECORD_BEFORE_SAVE = 'recordBeforeSave',
}

export enum RecordTriggerTypeEnum {
  CREATE = 'create',
  UPDATE = 'update',
  CREATE_OR_UPDATE = 'createOrUpdate',
  DELETE = 'delete',
}

export enum FlowTypeCodeEnum {
  SCREEN = 'SCREEN',
  PLAN_TRIGGER = 'PLAN_TRIGGER',
  AUTO_START_UP = 'AUTO_START_UP',
  RECORD_TRIGGER = 'RECORD_TRIGGER',
}

export enum opTypeEnum {
  INPUT = 'INPUT',
}

export interface IResourceParam {
  type: FlowResourceType
  name?: string
  children: IFieldMeta[]
}

export interface IFieldMetaResource extends IFieldMeta {
  webType: FlowResourceType
}

export enum IAuthorizationEnum {
  NO_AUTH = 'No Auth',
  BEARER_TOKEN = 'Bearer Token',
  BASIC_AUTH = 'Basic Auth',
}

export enum IHttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  CONNECT = 'CONNECT',
  TRACE = 'TRACE',
}

export enum IContentTypeEnum {
  NONE = 'none',
  FORM_DATA = 'form-data',
  X_WWW_FORM_URLENCODED = 'x-www-form-urlencoded',
  raw = 'raw',
  BINARY = 'binary',
  GRAPH_QL = 'GraphQL',
}
export interface IAuthorizationParams {
  type: IAuthorizationEnum
  username?: string
  password?: string
  token?: string
}

export interface ICallArgumentData {
  method: IHttpMethodEnum
  url: string
  contentType?: IContentTypeEnum
  pathParameters?: Record<string, string | number>
  queryParameters?: Record<string, string | number>
  cookies?: Record<string, string | number>
  headers?: Record<string, string | number>
  body?: Record<string, string | number>
  authorization?: IAuthorizationParams
}

export interface IShortcutJsonData extends ICallArgumentData {
  variable: Record<string, any>
}

export interface ICallArgumentFormily
  extends Omit<ICallArgumentData, 'pathParameters' | 'queryParameters'> {
  parameters?: Record<string, string | number>[]
}
