import { uid } from '@toy-box/toybox-shared'
import { onPanelEdit } from './index'

export const addFreeLayoutNode = (
  x: number,
  y: number,
  nodeType: string,
  nodes: any
) => {
  const nodeTemplate = nodes.find((template) => template.title === nodeType)
  onPanelEdit &&
    onPanelEdit(
      nodeTemplate,
      'freeLayout',
      {
        id: uid(),
        x: x - 120,
        y: y - 28,
        width: 60,
        height: 60,
        component: `${nodeType}Node`,
      },
      'FREE_START_UP'
    )
}