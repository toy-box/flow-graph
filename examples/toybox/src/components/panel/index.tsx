import React, { useCallback } from 'react'
import { useMetaFlow, useFreeFlow } from '@toy-box/flow-node'
import { flowData1, flowData2, flowMeta } from '../../data/flowData'

export const Panel = () => {
  const metaFlow = useMetaFlow()
  const freeFlow = useFreeFlow()
  const init = useCallback(() => {
    metaFlow.flow.setFlowNodes(flowData1)
  }, [])
  const update = useCallback(() => {
    metaFlow.flow.setFlowNodes(flowData2)
  }, [])
  const handleMetaFlow = useCallback(() => {
    metaFlow.setMetaFlow(flowMeta, 'AUTO_START_UP')
    metaFlow.flow.layoutFlow()
  }, [metaFlow])
  const handleExport = useCallback(() => {
    console.log('metaFlow', metaFlow)
    console.log('metaFlowdata数据json化', metaFlow.toJsonList)
  }, [metaFlow])
  const handleFreeLayout = useCallback(() => {
    // metaFlow.setMetaFlow(flowMeta, 'FREE_START_UP')
    // metaFlow.flow.setGraphNodes([])
    freeFlow.setMetaFlow(flowMeta, 'FREE_START_UP')
    console.log('metaFlow.flowType', metaFlow.flowType)
    freeFlow.flow.layoutFlow()
  }, [metaFlow])
  return (
    <div>
      <button onClick={init}>init</button>
      <button onClick={update}>update</button>
      <button onClick={handleMetaFlow}>metaflow</button>
      <button onClick={handleFreeLayout}>freeLayout</button>
      <button onClick={handleExport}>export</button>
    </div>
  )
}
