import { observable, define, action } from '@formily/reactive'
import {
  IFieldItems,
  IFieldMeta,
  IFieldOption,
  MetaValueType,
} from '@toy-box/meta-schema'
import { FlowResourceType, IUpdateFieldMetaVariable } from '../../types'

export interface IFieldMetaWithWeb extends IFieldMeta {
  webType: FlowResourceType
  isInput?: boolean
  isOutPut?: boolean
}

export class FlowVariable {
  key: string
  name: string
  description?: string
  primary?: boolean
  unique?: boolean
  primaryKey?: string
  parentKey?: string
  items?: IFieldItems
  index?: number
  type: MetaValueType | string
  options?: IFieldOption[]
  refRegisterId?: string
  required?: boolean
  maximum?: number
  minimum?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  precision?: number
  multipleOf?: number
  minProperties?: number
  maxProperties?: number
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  pattern?: string
  format?: string
  titleKey?: string
  defaultValue?: any
  properties?: Record<string, IFieldMeta>
  webType: FlowResourceType
  isInput?: boolean
  isOutPut?: boolean

  constructor(flowVariable: IFieldMetaWithWeb) {
    this.key = flowVariable.key
    this.name = flowVariable.name
    this.defaultValue = flowVariable.defaultValue
    this.description = flowVariable.description
    this.index = flowVariable.index
    this.items = flowVariable.items
    this.format = flowVariable.format
    this.required = flowVariable.required
    this.primary = flowVariable.primary
    this.parentKey = flowVariable.parentKey
    this.pattern = flowVariable.pattern
    this.refRegisterId = flowVariable.refRegisterId
    this.options = flowVariable.options
    this.properties = flowVariable.properties
    this.primaryKey = flowVariable.primaryKey
    this.type = flowVariable.type
    this.titleKey = flowVariable.titleKey
    this.multipleOf = flowVariable.multipleOf
    this.webType = flowVariable.webType
    this.isInput = flowVariable.isInput
    this.isOutPut = flowVariable.isOutPut
    this.makeObservable()
  }

  protected makeObservable() {
    define(this, {
      key: observable.ref,
      name: observable.ref,
      description: observable.ref,
      defaultValue: observable.ref,
      index: observable.ref,
      items: observable.deep,
      format: observable.ref,
      required: observable.ref,
      primary: observable.ref,
      parentKey: observable.ref,
      pattern: observable.ref,
      refRegisterId: observable.ref,
      options: observable.deep,
      properties: observable.shallow,
      primaryKey: observable.ref,
      type: observable.ref,
      titleKey: observable.ref,
      multipleOf: observable.ref,
      update: action,
    })
  }

  update = (updateData: IUpdateFieldMetaVariable) => {
    this.name = updateData.name
    this.description = updateData.description
    this.defaultValue = updateData.defaultValue
    this.isInput = updateData.isInput
    this.isOutPut = updateData.isOutPut
  }

  toJson = (): IFieldMetaWithWeb => {
    return {
      key: this.key,
      name: this.name,
      description: this.description,
      defaultValue: this.defaultValue,
      index: this.index,
      items: this.items,
      format: this.format,
      required: this.required,
      primary: this.primary,
      parentKey: this.parentKey,
      pattern: this.pattern,
      refRegisterId: this.refRegisterId,
      options: this.options,
      properties: this.properties,
      primaryKey: this.primaryKey,
      type: this.type,
      titleKey: this.titleKey,
      multipleOf: this.multipleOf,
      webType: this.webType,
      isInput: this.isInput,
      isOutPut: this.isOutPut,
    }
  }
}
