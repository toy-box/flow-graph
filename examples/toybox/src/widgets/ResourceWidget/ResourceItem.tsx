import React, { useCallback, useState } from 'react'
import { observer } from '@formily/reactive-react'
import {
  IconWidget,
  TextWidget,
  useLocale,
  usePrefix,
} from '@toy-box/studio-base'
import { resourceEdit } from '@toy-box/flow-designable'
import {
  FlowResourceType,
  FreeFlow,
  IFieldMetaFlow,
  IResourceParam,
} from '@toy-box/autoflow-core'
import cls from 'classnames'

import { DeleteFilled } from '@ant-design/icons'
import './styles.less'

// export type SourceMapper = (resource: ItemMapType) => React.ReactChild

export interface IResourceItemWidgetProps {
  source: IResourceParam
  className?: string
  defaultExpand?: boolean
  metaFlow: FreeFlow
  // children?: SourceMapper | React.ReactElement
}

export const ResourceItemWidget: React.FC<IResourceItemWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('resource-item')
    const [expand, setExpand] = useState(props.defaultExpand)
    const templateObj: any = {
      [FlowResourceType.VARIABLE]: useLocale(
        'toyboxStudio.flow.autoFlow.variable'
      ),
      [FlowResourceType.VARIABLE_RECORD]: useLocale(
        'toyboxStudio.flow.autoFlow.variableRecord'
      ),
      [FlowResourceType.VARIABLE_ARRAY]: useLocale(
        'toyboxStudio.flow.autoFlow.variableArray'
      ),
      [FlowResourceType.VARIABLE_ARRAY_RECORD]: useLocale(
        'toyboxStudio.flow.autoFlow.variableArrayRecord'
      ),
      [FlowResourceType.CONSTANT]: useLocale(
        'toyboxStudio.flow.autoFlow.constant'
      ),
      [FlowResourceType.FORMULA]: useLocale(
        'toyboxStudio.flow.autoFlow.formula'
      ),
      [FlowResourceType.TEMPLATE]: useLocale(
        'toyboxStudio.flow.autoFlow.template'
      ),
    }
    const editResource = useCallback((child: IFieldMetaFlow) => {
      resourceEdit(props.metaFlow, true, child, props.source?.type)
    }, [])
    const deleteResource = useCallback((child: IFieldMetaFlow) => {
      props.metaFlow.deleteResource(props?.source?.type, child.key)
    }, [])
    return (
      <>
        {props.source.children.length > 0 && (
          <div
            className={cls(prefix, props.className, {
              expand,
            })}
          >
            <div
              className={prefix + '-header'}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setExpand(!expand)
              }}
            >
              <div className={prefix + '-header-expand'}>
                <IconWidget infer="Expand" size={20} />
              </div>
              <div className={prefix + '-header-content'}>
                <TextWidget>{templateObj[props.source?.type]}</TextWidget>
              </div>
            </div>
            <div className={prefix + '-content-wrapper'}>
              <div className={prefix + '-content'}>
                {props.source.children.map((child, idx) => (
                  <div key={idx} className={prefix + '-content-item'}>
                    <div
                      className={prefix + '-content-item-name'}
                      onClick={() => editResource(child)}
                    >
                      {child.name}
                    </div>
                    <div className={prefix + '-content-item-icon'}>
                      <DeleteFilled onClick={() => deleteResource(child)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)

ResourceItemWidget.defaultProps = {
  defaultExpand: true,
}
