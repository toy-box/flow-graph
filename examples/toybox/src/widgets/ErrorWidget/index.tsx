import React, { FC } from 'react'
import { usePrefix } from '@toy-box/studio-base'
import { TextWidget } from '../TextWidget'
import './style.less'

export interface ErrorWidgetProps {
  dataList: any[]
}

export const ErrorWidget: FC<ErrorWidgetProps> = ({ dataList = [] }) => {
  const prefix = usePrefix('error-widget')
  const error = dataList.filter((error) => error.level === 'error')
  const warn = dataList.filter((error) => error.level === 'warn')

  return (
    <div className={prefix}>
      {error.length > 0 && (
        <div>
          <div className={prefix + '-title'}>
            {error.length}{' '}
            <TextWidget token="toyboxStudio.errorMessage.error"></TextWidget>
          </div>
          <ul className={prefix + '-ul'}>
            {error.map((item, index) => (
              <li className={prefix + '-ul-item'} key={index}>
                {item.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {warn.length > 0 && (
        <div>
          <div className={prefix + '-title'}>
            {warn.length}{' '}
            <TextWidget token="toyboxStudio.errorMessage.warn"></TextWidget>
          </div>
          <ul className={prefix + '-ul'}>
            {warn.map((item, index) => (
              <li className={prefix + '-ul-item'} key={index}>
                {item.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
