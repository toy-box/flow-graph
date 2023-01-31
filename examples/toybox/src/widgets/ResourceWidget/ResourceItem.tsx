import React, { useState } from 'react'
import { isFn } from '@designable/shared'
import { observer } from '@formily/reactive-react'
import { IconWidget, TextWidget, usePrefix } from '@toy-box/studio-base'
import { IResourceParam } from '@toy-box/autoflow-core'
import cls from 'classnames'
import './styles.less'

// export type SourceMapper = (resource: ItemMapType) => React.ReactChild

export interface IResourceItemWidgetProps {
  source: IResourceParam
  className?: string
  defaultExpand?: boolean
  // children?: SourceMapper | React.ReactElement
}

export const ResourceItemWidget: React.FC<IResourceItemWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('resource-item')
    const [expand, setExpand] = useState(props.defaultExpand)
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
                <TextWidget>{props.source?.type}</TextWidget>
              </div>
            </div>
            <div className={prefix + '-content-wrapper'}>
              <div className={prefix + '-content'}>
                {props.source.children.map((child, idx) => (
                  <div key={idx}>{child.name}</div>
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
