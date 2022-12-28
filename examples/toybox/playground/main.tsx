import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FlowContext, EventEngine } from '@toy-box/flow-node'
import { FlowModeEnum, MetaFlow, FreeFlow } from '@toy-box/autoflow-core'
import {
  icons,
  CompositePanel,
  TopbarPanel,
  CompositePanelContent,
  StudioPanel,
  WorkspacePanel,
} from '@toy-box/studio-base'
import { GlobalRegistry } from '@toy-box/designable-core'
import {
  Panel,
  FlowCanvas,
  LeftPanel,
  ErrorWidget,
  ResourceWidget,
} from '../src'
import { itemMap } from '../src/data/itemMap'
import { freeInitMeta } from '../src/data/flowData'
import { nodeTemplatesProvider } from './nodes'
import '../src/styles/theme.less'

GlobalRegistry.setDesignerLanguage('en-US')
GlobalRegistry.registerDesignerIcons(icons)

export const App: React.FC = () => {
  // const [leftVisible, setLeftVisible] = React.useState(false)
  // const [leftActiveKey, setLeftActiveKey] = React.useState()
  // const [rightVisible, setRightVisible] = React.useState(false)
  // const [rightActiveKey, setRightActiveKey] = React.useState()
  // const [errorData, setErrorData] = React.useState([])
  // const [warnData, setWarnData] = React.useState([])
  const eventEngine = new EventEngine()
  const metaFlow = new MetaFlow(FlowModeEnum.EDIT)
  const freeFlow = new FreeFlow(FlowModeEnum.EDIT)
  useEffect(() => {
    metaFlow.setMetaFlow({}, 'AUTO_START_UP')
    freeFlow.setMetaFlow(freeInitMeta, 'AUTO_START_UP')
  }, [metaFlow, freeFlow])
  return (
    <div className="App">
      <FlowContext.Provider
        value={{
          metaFlow,
          freeFlow,
          templates: nodeTemplatesProvider(metaFlow, freeFlow),
          icons: {},
          eventEngine,
        }}
      >
        <Panel />
        {/* <LeftPanel /> */}
      </FlowContext.Provider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
