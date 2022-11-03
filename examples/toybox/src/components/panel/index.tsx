import React, { useCallback } from 'react'
import { useMetaFlow } from '@toy-box/flow-node'
import { flowData1, flowData2, flowMeta } from '../../data/flowData'

export const Panel = () => {
  const metaFlow = useMetaFlow()
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
  }, [metaFlow])
  return (
    <div>
      <button onClick={init}>init</button>
      <button onClick={update}>update</button>
      <button onClick={handleMetaFlow}>metaflow</button>
      <button onClick={handleExport}>export</button>
    </div>
  )
}
