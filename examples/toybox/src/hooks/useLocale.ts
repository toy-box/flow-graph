import { useRegistry } from './useRegistry'

export const useLocale = (token: string) => {
  const registry = useRegistry()
  console.log(registry, registry?.getDesignerMessage(token))
  return registry?.getDesignerMessage(token) || token
}
