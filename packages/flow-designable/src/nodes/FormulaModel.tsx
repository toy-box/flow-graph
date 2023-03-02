import React, { FC, useState, CSSProperties, useRef } from 'react'
import { Modal, Button } from 'antd'
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
// import { MonacoInput } from '@toy-box/designable-react-settings-form'
import { TextWidget } from '@toy-box/studio-base'
import './index.less'
import { AutoFlow } from '../interface'
import { useFlowPrefix } from '../hooks'

export interface FormulaModelPorps {
  metaSchema?: Toybox.MetaSchema.Types.IFieldMeta[] | MetaSchemaObj
  value?: string
  onChange: (value: string) => void
  inputStyle?: CSSProperties
  valueType: MetaValueType
  metaFlow: AutoFlow
}

export interface MetaSchemaObj {
  groupId: string
  groupName: string
  list: IFieldMeta[]
}

export const FormulaModel: FC<FormulaModelPorps> = ({
  value,
  onChange,
  inputStyle,
  valueType,
  metaFlow,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [formulaValue, setFormulaValue] = useState(value || '')
  const prefix = useFlowPrefix('-powerfx-editor')
  const variableMap: Record<string, IFieldMeta> = {}
  const callback = (res: any) => {
    setFormulaValue(res)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    onChange(formulaValue)
  }

  const handleCancel = () => {
    setFormulaValue(value || '')
    setIsModalVisible(false)
  }

  return (
    <>
      <Button className={prefix} title={formulaValue} onClick={showModal}>
        <div className={prefix + '-icon'}>=</div>
        {formulaValue.length > 0 ? (
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
          <div>111111111</div>
          // <MonacoInput
          //   value={formulaValue}
          //   onChange={callback}
          //   width={'100%'}
          //   height={'400px'}
          // />
        )}
      </Modal>
    </>
  )
}
