import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlowContext, EventEngine } from '@toy-box/flow-node'
import { FlowModeEnum, MetaFlow, FreeFlow } from '@toy-box/autoflow-core'
import { icons } from '@toy-box/studio-base'
import { Button } from 'antd'
import { GlobalRegistry } from '@toy-box/designable-core'
import { Panel, Shortcut, shortcutOnEdit } from '../src'
import { freeInitMeta, freeMeta } from '../src/data/flowData'
import { deleteDialog, FlowCanvas } from '@toy-box/flow-designable'
import { nodeTemplatesProvider } from './nodes'
import '../src/styles/theme.less'
import ReactDOM from 'react-dom'

GlobalRegistry.setDesignerLanguage('en-US')
GlobalRegistry.registerDesignerIcons(icons)

export const Main: React.FC = () => {
  const [eventEngine, setEventEngine] = useState<any>()
  const [metaFlow, setMetaFlow] = useState<any>()
  const [freeFlow, setFreeFlow] = useState<any>()
  const [loading, setLoading] = useState(true)
  const history = useNavigate()
  useEffect(() => {
    setEventEngine(new EventEngine())
    setFreeFlow(new FreeFlow(FlowModeEnum.EDIT))
    setMetaFlow(new MetaFlow(FlowModeEnum.EDIT))
  }, [])
  const submit = useCallback(() => {
    history('/')
  }, [])
  useEffect(() => {
    if (freeFlow && metaFlow) {
      metaFlow.setMetaFlow(
        {
          resources: undefined,
          nodes: undefined,
        },
        'AUTO_START_UP'
      )
      setLoading(false)
      freeFlow.setMetaFlow(freeMeta, 'AUTO_START_UP')
    }
  }, [metaFlow, freeFlow])
  return (
    <div className="App">
      <Button onClick={submit}>返回</Button>
      <FlowContext.Provider
        value={{
          metaFlow: freeFlow,
          templates: nodeTemplatesProvider(metaFlow, freeFlow),
          icons: {},
          eventEngine,
          connectDialog: {
            deleteDialog,
          },
        }}
      >
        {freeFlow && <Panel metaFlow={freeFlow} />}
      </FlowContext.Provider>
    </div>
  )
}

// ReactDOM.render(<Main />, document.getElementById('root'))
