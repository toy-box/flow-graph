import { Main } from '../playground/main'

import { Test } from '../playground/test'

export type RouteCfg = {
  path: string
  component: any
  exact?: boolean
  routes?: RouteCfg[]
}

export const routes = [
  {
    path: '/',
    component: Test,
    exact: true,
  },
  {
    path: '/main',
    component: Main,
    exact: true,
  },
]
