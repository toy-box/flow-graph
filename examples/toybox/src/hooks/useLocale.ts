import { useRegistry } from './useRegistry'

export const useLocale = (token: string) => {
  const registry = useRegistry()
  return registry?.getDesignerMessage(token) || token
}
