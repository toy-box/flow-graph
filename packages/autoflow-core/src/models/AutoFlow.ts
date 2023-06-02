import { Flow, FlowModeEnum, LayoutModeEnum } from '@toy-box/flow-graph'
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { clone, isObj } from '@toy-box/toybox-shared'
import {
  FlowMetaParam,
  FlowResourceType,
  FlowType,
  IFieldMetaResource,
  IFlowMeta,
  IFlowMetaResource,
  IRecordObject,
  IResourceParam,
} from '../types'
import { FlowMetaNode } from './flow-nodes'
import { FlowVariable } from './flow-variables'
import { FlowModeType } from './MetaFlow'
import { History } from './History'

export abstract class AutoFlow {
  disposers: (() => void)[] = []
  flowMeta: IFlowMeta
  metaResourceDatas: IResourceParam[] = []
  registers: any[] = []
  flowResourceMap: Record<string, FlowVariable> = {}
  mode: FlowModeType = FlowModeEnum.EDIT
  flow: Flow
  metaFlowDatas: FlowMetaParam[] = []
  flowMetaNodeMap: Record<string, FlowMetaNode> = {}
  layoutMode?: LayoutModeEnum
  flowType: FlowType
  history: History
  shortCutDatas: FlowMetaParam[] = []
  recordObject: IRecordObject

  constructor(mode: FlowModeType, layoutMode: LayoutModeEnum, flow: Flow) {
    this.mode = mode
    this.layoutMode = layoutMode
    this.flow = flow ?? new Flow(this.layoutMode)
    this.metaResourceDatas = [
      {
        type: FlowResourceType.VARIABLE,
        children: [],
      },
      {
        type: FlowResourceType.VARIABLE_ARRAY,
        children: [],
      },
      {
        type: FlowResourceType.VARIABLE_RECORD,
        children: [],
      },
      {
        type: FlowResourceType.VARIABLE_ARRAY_RECORD,
        children: [],
      },
      {
        type: FlowResourceType.CONSTANT,
        children: [],
      },
      {
        type: FlowResourceType.FORMULA,
        children: [],
      },
      {
        type: FlowResourceType.TEMPLATE,
        children: [],
      },
    ]
  }

  initRegisters(data: any[]) {
    this.registers = data
    const objectRegister = this.registers.find(
      (reg) => reg.key === this?.recordObject?.objectId
    )
    if (objectRegister) {
      const registerOps = []
      for (const key in objectRegister) {
        if (objectRegister.properties.hasOwnProperty(key)) {
          const obj = objectRegister.properties[key]
          const option = {
            label: '$RECORD',
            key: '$RECORD',
            children: [],
          }
          const changeObj = this.setMetaChildren(option, obj)
          registerOps.push(changeObj)
        }
      }
    }
  }

  setMetaChildren = (obj: any, meta: IFieldMeta) => {
    if (meta.properties && isObj(meta.properties)) {
      for (const proKey in meta.properties) {
        if (meta.properties.hasOwnProperty(proKey)) {
          const p = meta.properties[proKey]
          const child = {
            label: p.name,
            key: p.key,
            type: p.type,
            children: [],
          }
          this.setMetaChildren(child, p)
          if (child?.children?.length === 0) {
            delete child?.children
          }
          obj?.children?.push(child)
        }
      }
      if (obj?.children?.length === 0) delete obj?.children
      return obj
    } else {
      if (obj?.children?.length === 0) delete obj?.children
      return obj
    }
  }

  onInitResource(resources) {
    const resourcePrarms = this.parseResource(resources)
    resourcePrarms.forEach((resource) => {
      const currentResource = new FlowVariable(resource)
      if (resource.webType === FlowResourceType.VARIABLE) {
        if (resource?.type === MetaValueType.ARRAY) {
          if (
            resource?.items?.type === MetaValueType.OBJECT ||
            resource?.items?.type === MetaValueType.OBJECT_ID
          ) {
            currentResource.webType = FlowResourceType.VARIABLE_ARRAY_RECORD
            this.setResourceChildren(
              FlowResourceType.VARIABLE_ARRAY_RECORD,
              currentResource
            )
          } else {
            currentResource.webType = FlowResourceType.VARIABLE_ARRAY
            this.setResourceChildren(
              FlowResourceType.VARIABLE_ARRAY,
              currentResource
            )
          }
        } else if (
          resource?.type === MetaValueType.OBJECT ||
          resource?.type === MetaValueType.OBJECT_ID
        ) {
          currentResource.webType = FlowResourceType.VARIABLE_RECORD
          this.setResourceChildren(
            FlowResourceType.VARIABLE_RECORD,
            currentResource
          )
        } else {
          currentResource.webType = FlowResourceType.VARIABLE
          this.setResourceChildren(FlowResourceType.VARIABLE, currentResource)
        }
      } else {
        currentResource.webType = resource.webType
        this.setResourceChildren(resource.webType, currentResource)
      }
    })
  }

  setResourceChildren(type: FlowResourceType, resource: FlowVariable) {
    this.flowResourceMap[resource.key] = resource
    const idx = this.metaResourceDatas.findIndex((meta) => meta.type === type)
    if (idx > -1) this.metaResourceDatas[idx].children.push(resource)
  }

  createResource(type: FlowResourceType, resource: IFieldMetaResource) {
    const obj: any = { ...resource }
    if (resource?.type === MetaValueType.ARRAY) {
      if (
        resource?.items?.type === MetaValueType.OBJECT ||
        resource?.items?.type === MetaValueType.OBJECT_ID
      ) {
        obj.webType = FlowResourceType.VARIABLE_ARRAY_RECORD
      } else {
        obj.webType = FlowResourceType.VARIABLE_ARRAY
      }
    } else if (
      resource?.type === MetaValueType.OBJECT ||
      resource?.type === MetaValueType.OBJECT_ID
    ) {
      obj.webType = FlowResourceType.VARIABLE_RECORD
    } else {
      obj.webType = obj.webType || FlowResourceType.VARIABLE
    }
    const currentResource = new FlowVariable(obj)
    this.flowResourceMap[resource.key] = currentResource
    const idx = this.metaResourceDatas.findIndex(
      (meta) => meta.type === obj.webType
    )
    if (idx > -1) this.metaResourceDatas[idx].children.push(currentResource)
  }

  editResource(type: FlowResourceType, resource: IFieldMetaResource) {
    const currentResource = this.flowResourceMap[resource.key]
    currentResource.update(resource)
  }

  deleteResource(type: FlowResourceType, key: string) {
    delete this.flowResourceMap[key]
    const idx = this.metaResourceDatas.findIndex((meta) => meta.type === type)
    if (idx > -1)
      this.metaResourceDatas[idx].children = this.metaResourceDatas[
        idx
      ].children.filter((child) => child.key !== key)
  }

  parseResource(resources: IFlowMetaResource) {
    const resourcePrarms: IFieldMetaResource[] = []
    for (const key in resources) {
      const res = resources[key].map((resource) => {
        return { ...resource, webType: key }
      })
      resourcePrarms.push(...res)
    }
    return resourcePrarms
  }

  initShortCuts(shortCutDatas: FlowMetaParam[]) {
    this.shortCutDatas = shortCutDatas
  }

  shortCutPush(shortcutItem: FlowMetaParam) {
    function checkUnique(id, list): boolean {
      return list.findIndex((item) => item.id === id) === -1
    }
    if (checkUnique(shortcutItem.id, this.shortCutDatas)) {
      const shortCutDatas = clone(this.shortCutDatas)
      shortCutDatas.push(shortcutItem)
      this.shortCutDatas = shortCutDatas
    }
  }

  changeMode(mode: FlowModeType) {
    this.mode = mode
  }

  updateMetaFlowDatas(metaFlowDatas: FlowMetaParam[]) {
    this.metaFlowDatas = metaFlowDatas
  }
}
