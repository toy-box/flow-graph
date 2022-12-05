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
    metaFlow.setMetaFlow(freeFlow.flowMeta ?? flowMeta, 'AUTO_START_UP')
    freeFlow.setMetaFlow({}, 'AUTO_START_UP')
    metaFlow.flow.layoutFlow()
  }, [metaFlow])
  const handleExport = useCallback(() => {
    console.log('freeFlow', freeFlow)
    console.log('freeFlowdata数据json化', freeFlow.toJsonList)
  }, [metaFlow])
  const handleFreeLayout = useCallback(() => {
    // metaFlow.flow.setGraphNodes([])
    console.log('metaFlow.flowMeta', metaFlow.flowMeta, metaFlow.toJsonList)
    freeFlow.setMetaFlow(
      metaFlow.toJsonList.length
        ? { resources: {}, nodes: metaFlow.toJsonList }
        : {},
      'FREE_START_UP'
    )
    metaFlow.setMetaFlow({}, 'FREE_START_UP')
    console.log('metaFlow.flowType', metaFlow.flowType)
    // freeFlow.
    // freeFlow..layoutFlow()
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
