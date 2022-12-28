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
  const [leftVisible, setLeftVisible] = React.useState(false)
  const [leftActiveKey, setLeftActiveKey] = React.useState()
  const [rightVisible, setRightVisible] = React.useState(false)
  const [rightActiveKey, setRightActiveKey] = React.useState()
  const [errorData, setErrorData] = React.useState([])
  const [warnData, setWarnData] = React.useState([])
  const eventEngine = new EventEngine()
  const metaFlow = new MetaFlow(FlowModeEnum.EDIT)
  const freeFlow = new FreeFlow(FlowModeEnum.EDIT)
  // useEffect(() => {
  //   freeFlow.setMetaFlow(freeInitMeta, 'AUTO_START_UP')
  //   metaFlow.setMetaFlow({}, 'AUTO_START_UP')
  // }, [metaFlow])
  return (
    <div className="App">
      <FlowContext.Provider
        value={{
          metaFlow: freeFlow,
          templates: nodeTemplatesProvider(metaFlow, freeFlow),
          icons: {},
          eventEngine,
        }}
      >
        <Panel />
        {/* <LeftPanel /> */}
        <StudioPanel>
          <TopbarPanel>
            <TopbarPanel.Region position="left">
              <CompositePanel
                visible={leftVisible}
                setVisible={setLeftVisible}
                activeKey={leftActiveKey}
                setActiveKey={setLeftActiveKey as any}
              >
                <CompositePanel.Item
                  title="flowDesigner.panels.resource"
                  icon="Add"
                />
              </CompositePanel>
            </TopbarPanel.Region>
            {/* <TopbarPanel.Region position="center">
            <CompositePanel>
              <CompositePanel.Item title="回退" onClick={back} icon="Undo" />
              <CompositePanel.Item title="前进" onClick={next} icon="Redo" />
            </CompositePanel>
          </TopbarPanel.Region> */}
            <TopbarPanel.Region position="right">
              <CompositePanel
                direction="right"
                visible={rightVisible}
                setVisible={setRightVisible}
                activeKey={rightActiveKey}
                setActiveKey={setRightActiveKey as any}
              >
                {/* <CompositePanel.Item
                title="flowDesigner.panels.warn"
                icon="Profile"
                activeKey="warn"
              /> */}
                <CompositePanel.Item
                  title="flowDesigner.panels.error"
                  icon="Profile"
                  activeKey="error"
                />
              </CompositePanel>
            </TopbarPanel.Region>
          </TopbarPanel>
          <div
            style={{
              display: 'flex',
              flexGrow: 1,
              height: 'calc(100% - 48px)',
            }}
          >
            <CompositePanelContent
              activeKey={leftActiveKey}
              visible={true}
              onClose={() => setLeftVisible(false)}
            >
              <CompositePanelContent.Item title="flowDesigner.panels.element">
                {/* <ResourceWidget flowGraph={flowGraph} /> */}
                {/* <LeftPanel /> */}
                <ResourceWidget
                  title="flowDesigner.panels.sources.logical"
                  sources={itemMap}
                />
              </CompositePanelContent.Item>
            </CompositePanelContent>
            <WorkspacePanel>
              {/* <FlowEditor /> */}
              <FlowCanvas />
            </WorkspacePanel>
            <CompositePanelContent
              visible={rightVisible}
              activeKey={rightActiveKey}
              onClose={() => setRightVisible(false)}
            >
              {/* <CompositePanelContent.Item
              title="flowDesigner.panels.warn"
              activeKey="warn"
            >
              <WarnWidget dataList={warnData} />
            </CompositePanelContent.Item> */}
              <CompositePanelContent.Item title="flowDesigner.panels.error">
                <ErrorWidget dataList={errorData} />
              </CompositePanelContent.Item>
            </CompositePanelContent>
          </div>
        </StudioPanel>
      </FlowContext.Provider>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
