import React, { useCallback, useEffect, useState } from 'react'
import { isFn } from '@designable/shared'
import { Button } from 'antd'
import { observer } from '@formily/reactive-react'
import { TextWidget, usePrefix } from '@toy-box/studio-base'
import { FreeFlow, IResourceParam } from '@toy-box/autoflow-core'
import { resourceEdit } from '@toy-box/flow-designable'
import cls from 'classnames'
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
    const createResource = useCallback(() => {
      resourceEdit(props.metaFlow, false)
    }, [])
    return (
      <div className={cls(prefix, props.className)}>
        <Button onClick={createResource} className={`${prefix}-btn`}>
          <TextWidget>toyboxStudio.resource.create</TextWidget>
        </Button>
        <div className={prefix + '-header-content'}>
          <TextWidget>{props?.title}</TextWidget>
        </div>
        {sources.map((source, idx) => (
          <div key={idx}>
            <ResourceItemWidget source={source} metaFlow={props.metaFlow} />
          </div>
        ))}
      </div>
    )
  }
)
