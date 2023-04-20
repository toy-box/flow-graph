import { AutoFlow } from './interface'

export const setResourceMetaflow = (metaFlow: AutoFlow) => {
  return {
    metaResourceDatas: metaFlow.metaResourceDatas,
    registers: metaFlow.registers,
    metaFlowDatas: metaFlow.metaFlowDatas,
    shortCutDatas: metaFlow.shortCutDatas,
    createResource: metaFlow.createResource,
    editResource: metaFlow.editResource,
  }
}
