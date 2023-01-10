import { GlobalRegistry, IDesignerRegistry } from '@toy-box/designable-core'

export const useRegistry = (): IDesignerRegistry => {
  return GlobalRegistry
}
