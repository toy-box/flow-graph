import { GlobalRegistry, IDesignerRegistry } from '@toy-box/designable-core'
import { useDesigner } from './useDesigner'

export const useRegistry = (): IDesignerRegistry => {
  const designer = useDesigner()
  return designer.GlobalRegistry
}
