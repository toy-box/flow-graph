import React, { FC, useState, useCallback, Fragment } from 'react'
import update from 'immutability-helper'
import classnames from 'classnames'
import { ISchema } from '@formily/json-schema'
import { ArrayField } from '@formily/core'
import { Button, Badge } from 'antd'
import { useLocale } from '@toy-box/studio-base'
import {
  useForm,
  observer,
  useField,
  useFieldSchema,
  RecursionField,
  ReactFC,
} from '@formily/react'
import { IFlowMetaDecisionRule } from '@toy-box/autoflow-core'
import './index.less'
import { ArrayBase } from './ArrayBase'

const isAdditionComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Addition') > -1
}

const isIndexComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Index') > -1
}

const isOperationComponent = (schema: ISchema) => {
  return isAdditionComponent(schema)
}

interface IFeedbackBadgeProps {
  index: number
  name: string
}

const FeedbackBadge: ReactFC<IFeedbackBadgeProps> = observer((props) => {
  const field = useField<ArrayField>()
  const tab = props.name
  const errors = field.errors.filter((error) =>
    error.address.includes(`${field.address}.${props.index}`)
  )
  if (errors.length) {
    return (
      <Badge size="small" className="errors-badge" count={errors.length}>
        {tab}
      </Badge>
    )
  }
  return <Fragment>{tab}</Fragment>
})

export const BranchArrays: FC = observer((props: any) => {
  const form = useForm()
  const field = useField<ArrayField>()
  const schema = useFieldSchema() as any
  const dataSource = Array.isArray(field.value) ? field.value : []
  // const defaultIndex = dataSource.length + 1
  const [selectIndex, setSelectIndex] = useState(0)
  const prefixCls = 'branch-arrays'

  const renderItems = () => {
    return dataSource?.map((item, index: number) => {
      const items = Array.isArray(schema.items)
        ? schema.items[index] || schema.items[0]
        : schema.items
      let removeTip = ''
      items?.mapProperties((schema1, name) => {
        removeTip =
          schema1['x-component-props']?.removeMessage ||
          useLocale('flowDesigner.comm.remove')
      })
      const content = (
        <RecursionField
          schema={items as any}
          name={index}
          filterProperties={(schema) => {
            if (isIndexComponent(schema)) return false
            if (isOperationComponent(schema)) return false
            return true
          }}
        />
      )
      return (
        <ArrayBase.Item key={index} index={index}>
          {index === selectIndex ? (
            <div className={`${prefixCls}-content-right`}>
              <div>
                {dataSource.length > 1 && (
                  <div className={`${prefixCls}-remove-btn`}>
                    <Button onClick={handleRemove}>{removeTip}</Button>
                  </div>
                )}
                {content}
              </div>
            </div>
          ) : null}
        </ArrayBase.Item>
      )
    })
  }

  const handleRemove = useCallback(() => {
    // form.setFieldState('rules', (state) => {
    //   state.value = update(state.value, { $splice: [[selectIndex, 1]] })
    // })
    field.remove(selectIndex)
    setSelectIndex(selectIndex - 1 < 0 ? selectIndex : selectIndex - 1)
  }, [field, selectIndex])

  const selectValue = useCallback((value: React.SetStateAction<number>) => {
    setSelectIndex(value)
  }, [])

  const renderContent = () => {
    return (
      <div className={prefixCls}>
        {props?.descTipHtml}
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-content-left`}>
            <div className={`${prefixCls}-content-left-top`}>
              <div className="left-title">
                <span>{props.addDescription}</span>
                {renderAddition()}
              </div>
            </div>
            <div className={`${prefixCls}-content-left-body`}>
              {dataSource?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => selectValue(index)}
                  className={classnames(
                    `${prefixCls}-content-item`,
                    dataSource?.[selectIndex]?.id === item.id ? 'active' : ''
                  )}
                >
                  <FeedbackBadge
                    name={item.name || props.title}
                    index={index}
                  ></FeedbackBadge>
                </div>
              ))}
              {/* <div key={defaultIndex}
                  onClick={() => selectValue(defaultIndex)}
                  className={classnames(
                    `${prefixCls}-content-item`,
                    selectIndex === defaultIndex ? 'active' : ''
                  )}>
                    <FeedbackBadge
                    name={form.values.defaultConnectorName}
                    index={defaultIndex}
                  ></FeedbackBadge>
              </div> */}
            </div>
          </div>
          {renderItems()}
        </div>
      </div>
    )
  }
  const addRule = useCallback(() => {
    const ruleItem: IFlowMetaDecisionRule = {
      name: '',
      id: '',
      criteria: {
        conditions: [{}],
        logic: '$and',
      },
      connector: {
        targetReference: null,
      },
      description: '',
    }
    form.setFieldState(field?.path?.entire, (state) => {
      state.value = update(state.value, { $push: [ruleItem] })
      selectValue(state.value?.length - 1)
    })
  }, [form])

  const renderAddition = () => {
    return (
      <Button size="small" onClick={addRule}>
        +
      </Button>
    )
  }

  return <div>{renderContent()}</div>
})

ArrayBase.mixin(BranchArrays)
