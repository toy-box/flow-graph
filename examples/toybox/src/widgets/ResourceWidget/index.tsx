import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'antd'
import { observer } from '@formily/reactive-react'
import { MetaValueType } from '@toy-box/meta-schema'
import { TextWidget, useLocale, usePrefix } from '@toy-box/studio-base'
import {
  FlowMetaType,
  FlowResourceType,
  FreeFlow,
  IResourceParam,
} from '@toy-box/autoflow-core'
import { resourceEdit } from '@toy-box/flow-designable'
import cls from 'classnames'
import cloneDeep from 'lodash.clonedeep'
import './styles.less'
import { ResourceItemWidget } from './ResourceItem'
export interface IResourceWidgetProps {
  title: React.ReactNode
  sources?: IResourceParam[]
  className?: string
  metaFlow: FreeFlow
  // children?: SourceMapper | React.ReactElement
}

export const ResourceWidget: React.FC<IResourceWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('resource')
    const { sources } = props
    const [currentSources, setCurrentSources] = useState(sources)
    const createResource = useCallback(() => {
      resourceEdit(props.metaFlow, false)
    }, [])
    useEffect(() => {
      const metaFlowNodes = props.metaFlow?.toJsonList
      const dataSources = cloneDeep(currentSources)
      if (metaFlowNodes) {
        metaFlowNodes.forEach((record) => {
          if (record.type === FlowMetaType.RECORD_LOOKUP) {
            if (
              !record.callArguments?.outputAssignments &&
              (record.callArguments?.storeOutputAutomatically ||
                (record.callArguments?.queriedFields &&
                  !record.callArguments?.outputReference))
            ) {
              const register = props?.metaFlow?.registers?.find(
                (reg) => reg.id === record.registerId
              )
              const labelName = `${useLocale(
                'flowDesigner.flow.form.resourceCreate.recordLookupLabel'
              )} ${record.id} ${useLocale(
                'flowDesigner.flow.form.resourceCreate.real'
              )} ${register.name}`
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
                fieldMeta.properties = register.properties
                const idx = dataSources.findIndex(
                  (source) => source.type === FlowResourceType.VARIABLE_RECORD
                )
                if (idx > -1) {
                  dataSources[idx].children.push(fieldMeta)
                } else {
                  dataSources.push({
                    type: FlowResourceType.VARIABLE_RECORD,
                    children: [fieldMeta],
                  })
                }
              } else {
                const idx = dataSources.findIndex(
                  (source) =>
                    source.type === FlowResourceType.VARIABLE_ARRAY_RECORD
                )
                fieldMeta.items = {
                  type: MetaValueType.OBJECT,
                  properties: register.properties,
                }
                if (idx > -1) {
                  dataSources[idx].children.push(fieldMeta)
                } else {
                  dataSources.push({
                    type: FlowResourceType.VARIABLE_ARRAY_RECORD,
                    children: [fieldMeta],
                  })
                }
              }
              setCurrentSources(dataSources)
            }
          }
        })
      }
    }, [])
    return (
      <div className={cls(prefix, props.className)}>
        <Button onClick={createResource} className={`${prefix}-btn`}>
          <TextWidget>toyboxStudio.resource.create</TextWidget>
        </Button>
        <div className={prefix + '-header-content'}>
          <TextWidget>{props?.title}</TextWidget>
        </div>
        {currentSources.map((source, idx) => (
          <div key={idx}>
            <ResourceItemWidget source={source} metaFlow={props.metaFlow} />
          </div>
        ))}
      </div>
    )
  }
)
