import React, { FC } from 'react'
import { useFlowPrefix } from '../../hooks'
import { TextWidget } from '../TextWidget'
// import './style'

export interface ErrorWidgetProps {
  dataList: any[]
}

export const ErrorWidget: FC<ErrorWidgetProps> = ({ dataList = [] }) => {
  const prefix = useFlowPrefix('-error-widget')
  const error = dataList.filter((error) => error.level === 'error')
  const warn = dataList.filter((error) => error.level === 'warn')

  return (
    <div className={prefix}>
      {error.length > 0 && (
        <div>
          <div className={prefix + '-title'}>
            <TextWidget token="studioApp.errorMessage.name"></TextWidget>{' '}
            {error.length}{' '}
            <TextWidget token="studioApp.errorMessage.error"></TextWidget>
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
            <TextWidget token="studioApp.errorMessage.name"></TextWidget>{' '}
            {warn.length}{' '}
            <TextWidget token="studioApp.errorMessage.warn"></TextWidget>
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
