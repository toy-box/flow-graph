import { http, appId } from './http'
import { AxiosResponse } from 'axios'

const path = 'business_object/' + appId

export interface IBusinessObjectResponse {
  name: string
  description: string
  items: {
    type: string
    items: string
  }
  titleKey: string
  parentKey: string
  tenantKey: string
  primaryKey: string
  createdKey: string
  updatedKey: string
  id: string
  key: string
  database: string
  type: string
  tenantId: string
  createdAt: string
  updatedAt: string
  tableStatus: string
  location: string
  isSystem: boolean
}

export function getAllBusinessObjects(): Promise<
  AxiosResponse<IBusinessObjectResponse[]>
> {
  return http.get(`${path}`)
}
