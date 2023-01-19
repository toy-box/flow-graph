import React, { useState } from 'react'
import { isFn } from '@designable/shared'
import { observer } from '@formily/reactive-react'
import { IconWidget, TextWidget, usePrefix } from '@toy-box/studio-base'
import cls from 'classnames'
import { ItemMapType } from '../../data/itemMap'
import './styles.less'

export type SourceMapper = (resource: ItemMapType) => React.ReactChild

export interface IElementNodeWidgetProps {
  title: React.ReactNode
  sources?: ItemMapType[]
  className?: string
  defaultExpand?: boolean
  children?: SourceMapper | React.ReactElement
}

const dragStart = (key, e) => {
  e.dataTransfer.setData('text/plain', key)
}

export const ElementNodeWidget: React.FC<IElementNodeWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('element-node')
    const [expand, setExpand] = useState(props.defaultExpand)
    const renderNode = (source: ItemMapType) => {
      const { icon, title, span, id, thumb } = source
      return (
        <div
          className={prefix + '-item'}
          style={{ gridColumnStart: `span ${span || 1}` }}
          key={id}
          draggable
          data-designer-source-id={id}
          onDragStart={(e) => dragStart(id, e)}
        >
          {thumb && <img className={prefix + '-item-thumb'} src={thumb} />}
          {icon && React.isValidElement(icon) ? (
            <>{icon}</>
          ) : (
            <IconWidget
              className={prefix + '-item-icon'}
              infer={icon}
              style={{ width: 150, height: 40 }}
            />
          )}
          <span className={prefix + '-item-text'}>
            {<TextWidget>{title}</TextWidget>}
          </span>
        </div>
      )
    }
    const remainItems =
      props.sources.reduce((length, source) => {
        return length + (source.span ?? 1)
      }, 0) % 3
    return (
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
            <IconWidget infer="Expand" size={10} />
          </div>
          <div className={prefix + '-header-content'}>
            <TextWidget>{props.title}</TextWidget>
          </div>
        </div>
        <div className={prefix + '-content-wrapper'}>
          <div className={prefix + '-content'}>
            {props.sources.map(
              isFn(props.children) ? props.children : renderNode
            )}
            {remainItems ? (
              <div
                className={prefix + '-item-remain'}
                style={{ gridColumnStart: `span ${3 - remainItems}` }}
              ></div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

ElementNodeWidget.defaultProps = {
  defaultExpand: true,
}
