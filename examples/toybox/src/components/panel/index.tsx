import React, { useCallback } from 'react'
import { useMetaFlow, useFreeFlow } from '@toy-box/flow-node'
import { flowData1, flowData2, flowMeta, freeMeta } from '../../data/flowData'
import { LayoutModeEnum } from '@toy-box/flow-graph'

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
    metaFlow.setMetaFlow(
      freeFlow.flowMeta ?? flowMeta,
      'AUTO_START_UP',
      LayoutModeEnum.AUTO_LAYOUT
    )
    freeFlow.setMetaFlow({}, 'AUTO_START_UP', LayoutModeEnum.AUTO_LAYOUT)
    metaFlow.flow.layoutFlow()
  }, [metaFlow])
  const handleExport = useCallback(() => {
    console.log('freeFlow', freeFlow)
    console.log('freeFlowdata数据json化', freeFlow.toJsonList)
  }, [metaFlow])
  const handleFreeLayout = useCallback(() => {
    // metaFlow.flow.setGraphNodes([])
    freeFlow.setMetaFlow(
      freeFlow.flowMeta ?? freeMeta,
      'AUTO_START_UP',
      LayoutModeEnum.FREE_LAYOUT
    )
    metaFlow.setMetaFlow({}, 'AUTO_START_UP', LayoutModeEnum.FREE_LAYOUT)
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
