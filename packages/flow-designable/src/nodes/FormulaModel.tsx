import React, {
  FC,
  useState,
  CSSProperties,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { Modal, Button, Input } from 'antd'
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
// import { MonacoInput } from '@toy-box/designable-react-settings-form'
import { PowerfxWorkerManager } from '@toy-box/powerfx-worker'
import { PowerFxFormulaEditor } from '@toy-box/powerfx-editor'
import { TextWidget } from '@toy-box/studio-base'
import './index.less'
import { IResourceMetaflow } from '../interface'
import { useFlowPrefix } from '../hooks'
import { isArr } from '@designable/shared'

export interface FormulaModelPorps {
  metaSchema?: Toybox.MetaSchema.Types.IFieldMeta[] | MetaSchemaObj
  value?: string[] | string
  disabled?: boolean
  onChange: (value: string) => void
  inputStyle?: CSSProperties
  valueType: MetaValueType
  metaFlow: IResourceMetaflow
}

export interface MetaSchemaObj {
  groupId: string
  groupName: string
  list: IFieldMeta[]
}

export const FormulaModel: FC<FormulaModelPorps> = ({
  value,
  onChange,
  disabled = false,
  inputStyle,
  valueType,
  metaFlow,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const val = isArr(value) ? value?.reverse()?.join('.') : value
  const [formulaValue, setFormulaValue] = useState(val || '')
  const [currentValue, setCurrentValue] = useState(val || '')
  const prefix = useFlowPrefix('-powerfx-editor')
  const variableMap: Record<string, IFieldMeta> = {}
  const [client, setClient] = useState<PowerfxWorkerManager>()
  const [context, setContext] = useState(
    JSON.stringify({ A: 'ABC', B: { Inner: 123 } })
  )
  const callback = (res: any) => {
    setFormulaValue(res)
  }

  useEffect(() => {
    setClient(new PowerfxWorkerManager())
    return () => {
      client?.dispose()
    }
  }, [])

  const showModal = () => {
    if (!disabled) setIsModalVisible(true)
  }

  const handleOk = useCallback(() => {
    setFormulaValue(currentValue)
    setIsModalVisible(false)
    onChange(currentValue)
  }, [currentValue])

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const changeValue = useCallback((e) => {
    setCurrentValue(e.target.value)
    console.log(value)
  }, [])

  return (
    <>
      <Button
        className={`${prefix} ${disabled ? 'disable' : ''}`}
        title={formulaValue}
        onClick={showModal}
      >
        <div className={prefix + '-icon'}>=</div>
        {formulaValue?.length > 0 ? (
          <div className={prefix + '-code'}>{formulaValue}</div>
        ) : (
          <div className={prefix + '-placeholder'}>
            {
              <TextWidget>
                flowDesigner.flow.form.placeholder.formula
              </TextWidget>
            }
          </div>
        )}
      </Button>
      <Modal
        width={900}
        title={<TextWidget>flowDesigner.flow.formula.editTitle</TextWidget>}
        visible={isModalVisible}
        cancelText={<TextWidget>flowDesigner.flow.form.comm.cancel</TextWidget>}
        okText={<TextWidget>flowDesigner.flow.form.comm.submit</TextWidget>}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isModalVisible && (
          // <Input value={currentValue} onChange={changeValue} />
          // <MonacoInput
          //   value={formulaValue}
          //   onChange={callback}
          //   width={'100%'}
          //   height={'400px'}
          // />
          <PowerFxFormulaEditor
            style={{ border: '1px solid grey' }}
            context={context}
            defaultValue={formulaValue}
            minLineCount={1}
            maxLineCount={6}
            // width={200}
            editorFocusOnMount={true}
            monacoEditorOptions={{
              fontSize: 14,
              fixedOverflowWidgets: false,
              minimap: {
                enabled: false,
              },
            }}
            onChange={(newValue: string): void => {
              setCurrentValue(() => newValue)
              // this._evalAsync(context, newValue);//计算自行处理
            }}
            onEditorDidMount={(editor, _): void => {
              // this._editor = editor;
            }}
            lspConfig={{
              disableDidOpenNotification: true,
              enableSignatureHelpRequest: false,
            }}
            variables={['$User', 'Name']}
            // metaData={metaData as any}
            client={client}
            metaData={{
              dataView: undefined,
              metaData: undefined,
            }} // setupWorker={setupWorker}
          />
        )}
      </Modal>
    </>
  )
}
