import { Flow, FlowModeEnum, LayoutModeEnum } from '@toy-box/flow-graph'
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { clone, isObj } from '@toy-box/toybox-shared'
import { useLocale } from '@toy-box/studio-base'
import {
  FlowMetaParam,
  FlowMetaType,
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
  metaResourceWithNodes: IResourceParam[] = []
  flowMetaNodeMap: Record<string, FlowMetaNode> = {}
  layoutMode?: LayoutModeEnum
  flowType: FlowType
  history: History
  shortCutDatas: FlowMetaParam[] = []
  recordObject: IRecordObject
  i8nDataMap: Record<string, string> = {}
  globalConsts: string[] = ['true', 'false']

  get flowMetaNodes() {
    return Object.keys(this.flowMetaNodeMap).map(
      (key) => this.flowMetaNodeMap[key]
    )
  }

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
    this.onInitResource(this.flowMeta.resources)
    this.metaResourceWithNodes = this.getMetaResourceWithNodes()
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

  getMetaResourceWithNodes() {
    const metaFlowNodes = this?.flowMetaNodes
    const dataSources = clone(this.metaResourceDatas)
    if (metaFlowNodes) {
      metaFlowNodes.forEach((record: any) => {
        this.updateDataSource(record, dataSources)
      })
    }
    return dataSources
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
    const idx1 = this.metaResourceWithNodes.findIndex(
      (meta) => meta.type === obj.webType
    )
    if (idx1 > -1)
      this.metaResourceWithNodes[idx].children.push(currentResource)
  }

  updateDataSource(record, dataSources) {
    if (record.type === FlowMetaType.RECORD_LOOKUP) {
      this.deleteDataResource(record.id, dataSources)
      if (
        !record.callArguments?.outputAssignments &&
        (record.callArguments?.storeOutputAutomatically ||
          (record.callArguments?.queriedFields &&
            !record.callArguments?.outputReference))
      ) {
        const register = this?.registers?.find(
          (reg) => reg.id === record.registerId
        )
        const labelName = `${useLocale(
          'flowDesigner.flow.form.resourceCreate.recordLookupLabel'
        )} ${record?.id} ${useLocale(
          'flowDesigner.flow.form.resourceCreate.real'
        )} ${register?.name}`
        const fieldMeta = {
          key: record.id,
          name: labelName,
          type: record.callArguments?.getFirstRecordOnly
            ? MetaValueType.OBJECT_ID
            : MetaValueType.ARRAY,
          registerId: register?.id,
          properties: null,
          items: null,
        }
        if (record.callArguments?.getFirstRecordOnly) {
          fieldMeta.properties = register?.properties
          const idx = dataSources.findIndex(
            (source) => source.type === FlowResourceType.VARIABLE_RECORD
          )
          if (idx > -1) {
            const childIdx = dataSources[idx].children.findIndex(
              (child) => child.key === fieldMeta.key
            )
            if (childIdx > -1) {
              dataSources[idx].children[childIdx] = fieldMeta
            } else {
              dataSources[idx].children.push(fieldMeta)
            }
          } else {
            dataSources.push({
              type: FlowResourceType.VARIABLE_RECORD,
              children: [fieldMeta],
            })
          }
        } else {
          const idx = dataSources.findIndex(
            (source) => source.type === FlowResourceType.VARIABLE_ARRAY_RECORD
          )
          fieldMeta.items = {
            type: MetaValueType.OBJECT,
            properties: register?.properties,
          }
          if (idx > -1) {
            const childIdx = dataSources[idx].children.findIndex(
              (child) => child.key === fieldMeta.key
            )
            if (childIdx > -1) {
              dataSources[idx].children[childIdx] = fieldMeta
            } else {
              dataSources[idx].children.push(fieldMeta)
            }
          } else {
            dataSources.push({
              type: FlowResourceType.VARIABLE_ARRAY_RECORD,
              children: [fieldMeta],
            })
          }
        }
      }
    }
    return dataSources
  }

  deleteDataResource(id: string, dataSources) {
    dataSources.forEach((meta) => {
      if (
        meta.type === FlowResourceType.VARIABLE_RECORD ||
        meta.type === FlowResourceType.VARIABLE_ARRAY_RECORD
      ) {
        meta.children = meta.children.filter((child) => child.key !== id)
      }
    })
    console.log(dataSources, 123)
  }

  editResource(type: FlowResourceType, resource: IFieldMetaResource) {
    const currentResource = this.flowResourceMap[resource.key]
    currentResource.update(resource)
  }

  deleteResource(type: FlowResourceType, key: string) {
    delete this.flowResourceMap[key]
    const idx = this.metaResourceDatas.findIndex((meta) => meta.type === type)
    const idx1 = this.metaResourceWithNodes.findIndex(
      (meta) => meta.type === type
    )
    if (idx > -1) {
      this.metaResourceDatas[idx].children = this.metaResourceDatas[
        idx
      ].children.filter((child) => child.key !== key)
    }
    if (idx1 > -1) {
      this.metaResourceWithNodes[idx1].children = this.metaResourceWithNodes[
        idx1
      ].children.filter((child) => child.key !== key)
    }
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

  setI8nDataMap = (dataMap) => {
    this.i8nDataMap = Object.assign(this.i8nDataMap, dataMap)
  }
}
