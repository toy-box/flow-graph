import React, { useCallback } from 'react'
import { useMetaFlow, useFreeFlow } from '@toy-box/flow-node'
import { flowData1, flowData2, flowMeta, freeMeta } from '../../data/flowData'
import { LayoutModeEnum } from '@toy-box/flow-graph'
import {
  icons,
  CompositePanel,
  TopbarPanel,
  CompositePanelContent,
  StudioPanel,
  WorkspacePanel,
} from '@toy-box/studio-base'
import {
  FlowCanvas,
  LeftPanel,
  ErrorWidget,
  ResourceWidget,
} from '../../../src'
import { itemMap } from '../../../src/data/itemMap'
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
    metaFlow.setMetaFlow(flowMeta, 'AUTO_START_UP', LayoutModeEnum.AUTO_LAYOUT)
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
      'AUTO_START_UP'
      // LayoutModeEnum.FREE_LAYOUT
    )
    metaFlow.setMetaFlow({}, 'AUTO_START_UP', LayoutModeEnum.FREE_LAYOUT)
    // freeFlow.
    // freeFlow..layoutFlow()
  }, [])
  const [leftVisible, setLeftVisible] = React.useState(false)
  const [leftActiveKey, setLeftActiveKey] = React.useState()
  const [rightVisible, setRightVisible] = React.useState(false)
  const [rightActiveKey, setRightActiveKey] = React.useState()
  const [errorData, setErrorData] = React.useState([])
  const [warnData, setWarnData] = React.useState([])
  return (
    // <div>
    //   <button onClick={init}>init</button>
    //   <button onClick={update}>update</button>
    //   <button onClick={handleMetaFlow}>metaflow</button>
    //   <button onClick={handleFreeLayout}>freeLayout</button>
    //   <button onClick={handleExport}>export</button>
    // </div>
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
          visible={leftVisible}
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
  )
}
