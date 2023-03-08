import React, { useCallback, useRef } from 'react'
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
import { FreeFlow } from '@toy-box/autoflow-core'
import { ErrorWidget, ElementNodeWidget, ResourceWidget } from '../../../src'
import { itemMap, itemMapAction } from '../../../src/data/itemMap'
import { Designer, FlowCanvas, variableOnEdit } from '@toy-box/flow-designable'
export const Panel: React.FC<any> = () => {
  const metaFlow = useMetaFlow()
  const freeFlow = useFreeFlow() as FreeFlow

  const metaService = {
    getMetaObjectData: (value) => {
      return null
    },
  }
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
  }, [])
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
    freeFlow.changeMode()
    isEditMode && setLeftVisible(false)
    isEditMode && setLeftActiveKey(null)
  }, [])
  const shortcut = useCallback(() => {
    console.log('freeFlow', freeFlow)
    const data = {
      name: 'George Washington',
      birthday: '{{birthday}}',
      address: '{{address}}',
      $variable: {
        type: 'object',
        properties: {
          birthday: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
        },
        required: ['birthday', 'address'],
      },
    }
    const data2 = [
      {
        name: 'h-test51',
        description: null,
        properties: {
          '111': {
            name: 'bbb',
            description: null,
            properties: null,
            items: null,
            key: '111',
            type: 'string',
            isSystem: false,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: false,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: null,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: true,
            updatable: false,
            filterable: true,
          },
          updated_at: {
            name: '修改时间',
            description: '修改时间',
            properties: null,
            items: null,
            key: 'updated_at',
            type: 'datetime',
            isSystem: true,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: true,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: 0,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: false,
            updatable: false,
            filterable: true,
          },
          ssss: {
            name: '11232',
            description: null,
            properties: null,
            items: null,
            key: 'ssss',
            type: 'string',
            isSystem: false,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: false,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: null,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: true,
            updatable: false,
            filterable: true,
          },
          created_at: {
            name: '创建时间',
            description: '创建时间',
            properties: null,
            items: null,
            key: 'created_at',
            type: 'datetime',
            isSystem: true,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: true,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: 0,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: false,
            updatable: false,
            filterable: true,
          },
          sssss: {
            name: '1111',
            description: null,
            properties: null,
            items: null,
            key: 'sssss',
            type: 'string',
            isSystem: false,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: false,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: null,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: 'formula',
            formula: '11ssss',
            creatable: true,
            updatable: false,
            filterable: true,
          },
          id: {
            name: 'ID',
            description: 'ID',
            properties: null,
            items: null,
            key: 'id',
            type: 'string',
            isSystem: true,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: true,
            options: null,
            unique: false,
            required: true,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: 32,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: false,
            updatable: false,
            filterable: true,
          },
        },
        items: null,
        titleKey: 'id',
        parentKey: null,
        tenantKey: null,
        primaryKey: 'id',
        createdKey: 'created_at',
        updatedKey: 'updated_at',
        id: 'h-test5',
        key: 'h-test51',
        database: 'studio',
        type: 'object',
        state: '1',
        tenantId: '04e3b1bdb26944e78295711f86fe3d9a',
        createdAt: '2022-04-24T12:09:02.000+08:00',
        updatedAt: '2022-04-24T12:09:02.000+08:00',
        tableStatus: 'C',
        location: null,
        isSystem: false,
      },
      {
        name: 'h-test52',
        description: null,
        properties: {
          '111': {
            name: 'bbb',
            description: null,
            properties: null,
            items: null,
            key: '111',
            type: 'string',
            isSystem: false,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: false,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: null,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: true,
            updatable: false,
            filterable: true,
          },
          updated_at: {
            name: '修改时间',
            description: '修改时间',
            properties: null,
            items: null,
            key: 'updated_at',
            type: 'datetime',
            isSystem: true,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: true,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: 0,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: false,
            updatable: false,
            filterable: true,
          },
          ssss: {
            name: '11232',
            description: null,
            properties: null,
            items: null,
            key: 'ssss',
            type: 'string',
            isSystem: false,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: false,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: null,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: true,
            updatable: false,
            filterable: true,
          },
          created_at: {
            name: '创建时间',
            description: '创建时间',
            properties: null,
            items: null,
            key: 'created_at',
            type: 'datetime',
            isSystem: true,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: true,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: 0,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: false,
            updatable: false,
            filterable: true,
          },
          sssss: {
            name: '1111',
            description: null,
            properties: null,
            items: null,
            key: 'sssss',
            type: 'string',
            isSystem: false,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: false,
            options: null,
            unique: false,
            required: false,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: null,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: 'formula',
            formula: '11ssss',
            creatable: true,
            updatable: false,
            filterable: true,
          },
          id: {
            name: 'ID',
            description: 'ID',
            properties: null,
            items: null,
            key: 'id',
            type: 'string',
            isSystem: true,
            primaryKey: null,
            refLookupKey: null,
            refRegisterId: null,
            selfWhenDeleteRef: null,
            refWhenDeleteSelf: null,
            primary: true,
            options: null,
            unique: false,
            required: true,
            precision: null,
            maximum: null,
            minimum: null,
            exclusiveMaximum: null,
            exclusiveMinimum: null,
            maxLength: 32,
            minLength: null,
            minItems: null,
            maxItems: null,
            uniqueItems: null,
            pattern: null,
            format: null,
            titleKey: null,
            parentKey: null,
            multipleOf: null,
            minProperties: null,
            maxProperties: null,
            calcType: null,
            formula: null,
            creatable: false,
            updatable: false,
            filterable: true,
          },
        },
        items: null,
        titleKey: 'id',
        parentKey: null,
        tenantKey: null,
        primaryKey: 'id',
        createdKey: 'created_at',
        updatedKey: 'updated_at',
        id: 'h-test5',
        key: 'h-test52',
        database: 'studio',
        type: 'object',
        state: '1',
        tenantId: '04e3b1bdb26944e78295711f86fe3d9a',
        createdAt: '2022-04-24T12:09:02.000+08:00',
        updatedAt: '2022-04-24T12:09:02.000+08:00',
        tableStatus: 'C',
        location: null,
        isSystem: false,
      },
    ]
    // console.log('ActionForm', convertMetaToFormily(data2))
    console.log('valid', new ActionForm(data2).isDataValid)
    variableOnEdit(convertMetaToFormily(data2))
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
                title="flowDesigner.panels.element"
                icon="Layout"
                activeKey="1"
              />
              <CompositePanel.Item
                title="flowDesigner.panels.resource"
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
                title="创建快捷方式"
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
                title="flowDesigner.panels.debug"
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
          title="flowDesigner.panels.warn"
          icon="Profile"
          activeKey="warn"
        /> */}
              <CompositePanel.Item
                title="flowDesigner.panels.error"
                icon="Profile"
                activeKey="error"
              />
              <CompositePanel.Item
                title={<Button>{useLocale('flowDesigner.comm.submit')}</Button>}
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
              title="flowDesigner.panels.element"
              activeKey="1"
            >
              {/* <ResourceWidget flowGraph={flowGraph} /> */}
              {/* <LeftPanel /> */}
              <ElementNodeWidget
                title="flowDesigner.panels.sources.logical"
                sources={itemMap}
              />
              <ElementNodeWidget
                title="flowDesigner.panels.sources.action"
                sources={itemMapAction}
              />
            </CompositePanelContent.Item>
            <CompositePanelContent.Item
              title="flowDesigner.panels.resource"
              activeKey="resource"
            >
              {/* <ResourceWidget flowGraph={flowGraph} /> */}
              {/* <LeftPanel /> */}
              <ResourceWidget
                title="flowDesigner.panels.resource"
                sources={
                  freeFlow instanceof FreeFlow && freeFlow?.metaResourceDatas
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
        title="flowDesigner.panels.warn"
        activeKey="warn"
      >
        <WarnWidget dataList={warnData} />
      </CompositePanelContent.Item> */}
            <CompositePanelContent.Item
              activeKey="error"
              title="flowDesigner.panels.error"
            >
              <ErrorWidget dataList={errorData} />
            </CompositePanelContent.Item>
          </CompositePanelContent>
        </div>
      </StudioPanel>
    </Designer>
  )
}
