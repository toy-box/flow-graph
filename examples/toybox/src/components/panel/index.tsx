import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useMetaFlow, useFreeFlow } from '@toy-box/flow-node'
import {
  ActionForm,
  isJSON,
  convertJSONSchemaToFormily,
  convertMetaToFormily,
} from '@toy-box/action-template'
import { LayoutModeEnum, FlowModeEnum } from '@toy-box/flow-graph'
import { Button } from 'antd'
import {
  icons,
  CompositePanel,
  TopbarPanel,
  CompositePanelContent,
  StudioPanel,
  WorkspacePanel,
  useLocale,
} from '@toy-box/studio-base'
import { FreeFlow, MetaFlow } from '@toy-box/autoflow-core'
import { observer } from '@formily/reactive-react'
import { Designer, FlowCanvas, variableOnEdit } from '@toy-box/flow-designable'
import { ErrorWidget, ElementNodeWidget, ResourceWidget } from '../../../src'
import { itemMap, itemMapDatas, itemMapAction } from '../../../src/data/itemMap'
import { shortcutOnEdit } from '../shortcut'
import { getAllBusinessObjects } from '../../services/businessObject.service'

export interface IPanelProps {
  metaFlow: MetaFlow | FreeFlow
}

export const Panel: React.FC<any> = observer(({ metaFlow }) => {
  const freeFlow = metaFlow as FreeFlow

  const metaService = {
    getMetaObjectData: () => getAllBusinessObjects(),
  }

  const itemMapShortcut = useMemo(() => {
    return freeFlow?.shortCutDatas?.map(({ id, name }) => {
      return {
        id: id ?? 'Shortcut',
        type: 'Shortcut',
        title: name ?? 'flowDesigner.flow.extend.shortcut',
        thumb:
          'https://cdnmarket.sasago.com/microIcon/componentsIcon/titleText.png',
      }
    })
  }, [freeFlow?.shortCutDatas])
  // const init = useCallback(() => {
  //   metaFlow.flow.setFlowNodes(flowData1)
  // }, [])
  // const update = useCallback(() => {
  //   metaFlow.flow.setFlowNodes(flowData2)
  // }, [])
  // const handleMetaFlow = useCallback(() => {
  //   metaFlow.setMetaFlow(flowMeta, 'AUTO_START_UP', LayoutModeEnum.AUTO_LAYOUT)
  //   freeFlow.setMetaFlow({}, 'AUTO_START_UP', LayoutModeEnum.AUTO_LAYOUT)
  //   metaFlow.flow.layoutFlow()
  // }, [metaFlow])
  const handleExport = useCallback(() => {
    console.log('freeFlow', freeFlow.history.list())
    console.log('freeFlowdata数据json化', freeFlow.toJsonList)
    console.log('变了数据json化', freeFlow.toVarJsonList)
  }, [freeFlow])
  // const handleFreeLayout = useCallback(() => {
  //   // metaFlow.flow.setGraphNodes([])
  //   freeFlow.setMetaFlow(
  //     freeFlow.flowMeta ?? freeMeta,
  //     'AUTO_START_UP'
  //     // LayoutModeEnum.FREE_LAYOUT
  //   )
  //   metaFlow.setMetaFlow({}, 'AUTO_START_UP', LayoutModeEnum.FREE_LAYOUT)
  //   // freeFlow.
  //   // freeFlow..layoutFlow()
  // }, [])
  const [leftVisible, setLeftVisible] = React.useState(false)
  const [leftActiveKey, setLeftActiveKey] = React.useState()
  const [rightVisible, setRightVisible] = React.useState(false)
  const [debugVisible, setDebugVisible] = React.useState(false)
  const [shortcutVisible, setShortcutVisible] = React.useState(false)
  const [scActiveKey, setScActiveKey] = React.useState()
  const [rightActiveKey, setRightActiveKey] = React.useState()
  const [debugActiveKey, setDebugActiveKey] = React.useState()
  const [errorData, setErrorData] = React.useState([])
  const [warnData, setWarnData] = React.useState([])

  const back = useCallback(() => {
    freeFlow.mode === FlowModeEnum.EDIT && freeFlow.history.undo()
  }, [])
  const next = useCallback(() => {
    freeFlow.mode === FlowModeEnum.EDIT && freeFlow.history.redo()
  }, [])
  const isEditMode = freeFlow.mode === FlowModeEnum.EDIT
  const debug = useCallback(() => {
    console.log('freeFlow', freeFlow)
    freeFlow.changeMode()
    isEditMode && setLeftVisible(false)
    isEditMode && setLeftActiveKey(null)
  }, [])
  const shortcut = useCallback(() => {
    shortcutOnEdit(freeFlow, undefined, setScActiveKey)
  }, [])

  return (
    // <div>
    //   <button onClick={init}>init</button>
    //   <button onClick={update}>update</button>
    //   <button onClick={handleMetaFlow}>metaflow</button>
    //   <button onClick={handleFreeLayout}>freeLayout</button>
    //   <button onClick={handleExport}>export</button>
    // </div>
    <Designer
      metaFlow={freeFlow}
      layoutMode={LayoutModeEnum.FREE_LAYOUT}
      metaService={metaService}
    >
      <StudioPanel>
        <TopbarPanel>
          <TopbarPanel.Region position="left">
            <CompositePanel
              visible={leftVisible}
              setVisible={setLeftVisible}
              activeKey={leftActiveKey}
              setActiveKey={isEditMode && (setLeftActiveKey as any)}
            >
              <CompositePanel.Item
                title="toyboxStudio.panels.element"
                icon="Layout"
                activeKey="1"
              />
              <CompositePanel.Item
                title="toyboxStudio.panels.resource"
                icon="Add"
                activeKey="resource"
              />
            </CompositePanel>
          </TopbarPanel.Region>
          <TopbarPanel.Region position="center">
            <CompositePanel>
              <CompositePanel.Item
                title="back"
                shape="button"
                onClick={back}
                icon="Undo"
                activeKey="2"
              />
              <CompositePanel.Item
                title="next"
                shape="button"
                onClick={next}
                icon="Redo"
              />
            </CompositePanel>
          </TopbarPanel.Region>
          <TopbarPanel.Region position="right">
            <CompositePanel
              direction="right"
              visible={shortcutVisible}
              setVisible={setShortcutVisible}
              activeKey={scActiveKey}
              setActiveKey={setScActiveKey as any}
            >
              <CompositePanel.Item
                title="Create Shortcut"
                icon="Profile"
                activeKey="shortcut"
                onClick={shortcut}
              />
            </CompositePanel>
            <CompositePanel
              direction="right"
              visible={debugVisible}
              setVisible={setDebugVisible}
              activeKey={debugActiveKey}
              setActiveKey={setDebugActiveKey as any}
            >
              <CompositePanel.Item
                title="toyboxStudio.panels.debug"
                icon="Profile"
                activeKey="debug"
                onClick={debug}
              />
            </CompositePanel>
            <CompositePanel
              direction="right"
              visible={rightVisible}
              setVisible={setRightVisible}
              activeKey={rightActiveKey}
              setActiveKey={setRightActiveKey as any}
            >
              {/* <CompositePanel.Item
          title="toyboxStudio.panels.warn"
          icon="Profile"
          activeKey="warn"
        /> */}
              <CompositePanel.Item
                title="toyboxStudio.panels.error"
                icon="Profile"
                activeKey="error"
              />
              <CompositePanel.Item
                title={<Button>{useLocale('toyboxStudio.comm.submit')}</Button>}
                shape="button"
                onClick={handleExport}
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
            <CompositePanelContent.Item
              title="toyboxStudio.panels.element"
              activeKey="1"
            >
              {/* <ResourceWidget flowGraph={flowGraph} /> */}
              {/* <LeftPanel /> */}
              <ElementNodeWidget
                title="toyboxStudio.panels.sources.logical"
                sources={itemMap}
              />
              <ElementNodeWidget
                title="toyboxStudio.panels.sources.data"
                sources={itemMapDatas}
              />
              <ElementNodeWidget
                title="toyboxStudio.panels.sources.action"
                sources={itemMapAction}
              />
              <ElementNodeWidget
                title="flowDesigner.panels.sources.shortcut"
                sources={itemMapShortcut}
              />
            </CompositePanelContent.Item>
            <CompositePanelContent.Item
              title="toyboxStudio.panels.resource"
              activeKey="resource"
            >
              {/* <ResourceWidget flowGraph={flowGraph} /> */}
              {/* <LeftPanel /> */}
              <ResourceWidget
                title="toyboxStudio.panels.resource"
                sources={
                  freeFlow instanceof FreeFlow && freeFlow?.resourceAllMetas
                }
                metaFlow={freeFlow instanceof FreeFlow && freeFlow}
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
        title="toyboxStudio.panels.warn"
        activeKey="warn"
      >
        <WarnWidget dataList={warnData} />
      </CompositePanelContent.Item> */}
            <CompositePanelContent.Item
              activeKey="error"
              title="toyboxStudio.panels.error"
            >
              <ErrorWidget dataList={errorData} />
            </CompositePanelContent.Item>
          </CompositePanelContent>
        </div>
      </StudioPanel>
    </Designer>
  )
})
