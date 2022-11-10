import React, { FC } from 'react'

export interface ComponentItemProps {
  title: string
  icon: string
}

export const ComponentItem: FC<ComponentItemProps> = ({ title, icon }) => {
  const iconUrl = `https://cdnmarket.sasago.com/microIcon/componentsIcon/${icon}.png`
  return (
    <React.Fragment>
      <div className="component-item__icon">
        <img className="component-item__icon-img" src={iconUrl} />
      </div>
      <div className="component-item__title">{title}</div>
    </React.Fragment>
  )
}
