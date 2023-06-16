import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Input, Tag } from 'antd'
import { observer } from '@formily/reactive-react'
import { clone, isObj, isStr } from '@formily/shared'
import { useField, useForm } from '@formily/react'
import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { TextWidget, useLocale } from '@toy-box/studio-base'
import {
  FlowMetaType,
  FlowResourceType,
  IFieldMetaFlow,
} from '@toy-box/autoflow-core'
import get from 'lodash.get'
import cloneDeep from 'lodash.clonedeep'
import { isArr, isBool } from '@designable/shared'
import { FormulaModel, resourceEdit } from '../../../nodes'
import './index.less'

export enum InputtypeEnum {
  BASE = 'BASE',
  FORMULA = 'FORMULA',
}

export const ResourceSelect: FC = observer((props: any) => {
  const form = useForm()
  const formilyField = useField() as any
  const [visible, setVariable] = useState(false)
  const [inputValue, setInputValue] = useState(null)
  const [selectKeys, setSelectKeys] = useState([])
  const [inputType, setInputType] = useState(InputtypeEnum.BASE)
  const ref = useRef()
  const [flag, setFlag] = useState(true)
  const [items, setItems] = useState<MenuProps['items']>([])
  const [historyItems, setHistoryItems] = useState([])

  const templateObj: any = {
    [FlowResourceType.VARIABLE]: useLocale(
      'flowDesigner.flow.autoFlow.variable'
    ),
    [FlowResourceType.VARIABLE_RECORD]: useLocale(
      'flowDesigner.flow.autoFlow.variableRecord'
    ),
    [FlowResourceType.VARIABLE_ARRAY]: useLocale(
      'flowDesigner.flow.autoFlow.variableArray'
    ),
    [FlowResourceType.VARIABLE_ARRAY_RECORD]: useLocale(
      'flowDesigner.flow.autoFlow.variableArrayRecord'
    ),
    [FlowResourceType.CONSTANT]: useLocale(
      'flowDesigner.flow.autoFlow.constant'
    ),
    [FlowResourceType.FORMULA]: useLocale('flowDesigner.flow.autoFlow.formula'),
    [FlowResourceType.TEMPLATE]: useLocale(
      'flowDesigner.flow.autoFlow.template'
    ),
    [FlowResourceType.GLOBAL_VARIABLE]: useLocale(
      'flowDesigner.flow.autoFlow.global_variable'
    ),
  }

  const metaDataOps = {
    [MetaValueType.STRING]: (
      <TextWidget>flowDesigner.flow.metaType.str</TextWidget>
    ),
    [MetaValueType.NUMBER]: (
      <TextWidget>flowDesigner.flow.metaType.num</TextWidget>
    ),
    [MetaValueType.OBJECT]: (
      <TextWidget>flowDesigner.flow.metaType.objectId</TextWidget>
    ),
    [MetaValueType.TEXT]: (
      <TextWidget>flowDesigner.flow.metaType.text</TextWidget>
    ),
    [MetaValueType.BOOLEAN]: (
      <TextWidget>flowDesigner.flow.metaType.bool</TextWidget>
    ),
    [MetaValueType.DATE]: (
      <TextWidget>flowDesigner.flow.metaType.date</TextWidget>
    ),
    [MetaValueType.DATETIME]: (
      <TextWidget>flowDesigner.flow.metaType.dateTime</TextWidget>
    ),
    [MetaValueType.ARRAY]: (
      <TextWidget>flowDesigner.flow.metaType.array</TextWidget>
    ),
    [MetaValueType.SINGLE_OPTION]: (
      <TextWidget>flowDesigner.flow.metaType.singleOption</TextWidget>
    ),
    [MetaValueType.MULTI_OPTION]: (
      <TextWidget>flowDesigner.flow.metaType.multiOption</TextWidget>
    ),
    [MetaValueType.OBJECT_ID]: (
      <TextWidget>flowDesigner.flow.metaType.refId</TextWidget>
    ),
  }

  useEffect(() => {
    if (flag) return
    const val = formilyField?.value
    const len = val?.length
    if (isStr(val) && val.startsWith('{!') && val.endsWith('}')) {
      const newVal = val.slice(2, len - 1)
      const reval = newVal?.split('.')?.reverse()
      setSelectKeys(reval || [])
      setInputValue(null)
      initData(true, reval)
    } else {
      if (isStr(val) && val) {
        const newVal = val?.split('.')?.reverse()
        setSelectKeys(newVal)
        setInputValue(null)
        initData(false, newVal)
      } else {
        setSelectKeys([])
        setInputValue(null)
      }
    }
  }, [flag])

  const onChange = useCallback(
    (value: string[] | string, parentType?: FlowResourceType) => {
      form.setFieldState(formilyField?.path?.entire, (state) => {
        let val = cloneDeep(value)
        if (isArr(val)) {
          val = props?.isFormula
            ? `{!${val?.reverse()?.join('.')}}`
            : val?.reverse()?.join('.')
        } else if (selectKeys.length > 0) {
          val = props?.isFormula ? `{!${value}}` : value
        }
        state.value = val
        formilyField.validate()
      })
    },
    [form, formilyField, props?.isFormula, selectKeys]
  )

  const onChangeValue = useCallback(
    (value: string) => {
      form.setFieldState(formilyField?.path?.entire, (state) => {
        state.value = `{!${value}}`
        // setInputValue(value)
        const selects = value?.split('.') || []
        setSelectKeys(selects)
        const length = selects?.length
        const selectKey = selects[length - 1]
        let val = null
        historyItems.some((item) => {
          if (item.id === selectKey || item.key === selectKey) {
            val = item.labelName
            if (val) setInputValue(val)
            return true
          }
          if (item?.children?.length > 0) {
            val = findName(item?.children, selectKey, length)
            setInputValue(val)
            return val
          }
        })
        if (!val) {
          setSelectKeys([])
          setInputValue(value)
        }
        formilyField.validate()
      })
    },
    [form, formilyField, historyItems]
  )

  const changeInputType = useCallback(
    (type: InputtypeEnum) => {
      setInputType(type)
      const val = clone(formilyField?.value)
      const len = val?.length
      if (isStr(val) && val.startsWith('{!') && val.endsWith('}')) {
        if (selectKeys.length === 0 && type !== InputtypeEnum.FORMULA) {
          form.setFieldState(formilyField?.path?.entire, (state) => {
            const newVal = val.slice(2, len - 1)
            state.value = newVal
            formilyField.validate()
          })
        }
      } else {
        if (selectKeys.length > 0 || type === InputtypeEnum.FORMULA) {
          form.setFieldState(formilyField?.path?.entire, (state) => {
            state.value = `{!${val}}`
            formilyField.validate()
          })
        }
      }
    },
    [formilyField?.value]
  )

  const reactionPath = useMemo(() => {
    const segments = formilyField?.path?.segments
    const length = segments?.length
    const arr = segments.slice(0, length - 1)
    return arr
  }, [formilyField?.path?.segments])

  const reactionKey = useMemo(() => {
    const arr = clone(reactionPath)
    arr.push(props?.reactionKey)
    return arr
  }, [reactionPath, props?.reactionKey])

  const disabled = useMemo(() => {
    const reactionValue = get(form.values, reactionKey)
    if (props?.reactionKey) {
      return !reactionValue
    }
    return false
  }, [get(form.values, reactionKey)])

  useEffect(() => {
    setFlag(true)
    if (props?.sourceMode === 'objectService') {
      let registerOps = []
      if (props.objectKey) {
        const objectKey = form.values[props.objectKey]
        props.metaFlow?.registers?.some(
          (re: {
            id: any
            properties: {
              [x: string]: any
              hasOwnProperty: (arg0: string) => any
            }
          }) => {
            if (re.id === objectKey) {
              for (const key in re.properties) {
                if (re.properties.hasOwnProperty(key)) {
                  const obj = re.properties[key]
                  const option = {
                    label: itemLabelName(obj),
                    labelName: obj.name,
                    key: obj.key,
                    dataType: obj.type,
                    children: [],
                  }
                  if (props?.registerOpType) {
                    const bool = obj[props.registerOpType]
                    if (bool) {
                      const changeObj = setMetaChildren(option, obj)
                      registerOps.push(changeObj)
                    }
                  } else {
                    const changeObj = setMetaChildren(option, obj)
                    registerOps.push(changeObj)
                  }
                }
              }
              return true
            }
            return false
          }
        )
      } else {
        registerOps =
          props.metaFlow?.registers?.map((r: any) => {
            const obj = {
              label: itemLabelName(r),
              labelName: r.name,
              key: r.id,
              dataType: r.type,
              children: [],
            }
            const changeObj = setMetaChildren(obj, r)
            return changeObj
          }) || []
      }
      setItems(registerOps)
      setHistoryItems(registerOps)
    } else {
      const metaResourceDatas = clone(props?.metaFlow?.metaResourceDatas)
      const arr = [
        {
          key: '0',
          label: useLocale('flowDesigner.flow.form.resourceCreate.createTitle'),
          icon: <PlusOutlined />,
        },
      ]
      if (metaResourceDatas) {
        const metaArr = metaResourceDatas
          .filter((source) => {
            if (isArr(props?.flowJsonTypes)) {
              if (source.children.length > 0) {
                const bol = props?.flowJsonTypes.some(
                  (flowType) => flowType.value === source.type
                )
                return bol
              }
            } else {
              if (source.children.length > 0) return true
            }
          })
          .map((meta) => {
            const children = meta.children.map((child) => {
              const obj = {
                label: itemLabelName(child),
                labelName: child.name,
                key: child.key,
                dataType: child.type,
                parentType: child.webType,
                children: [],
              }
              const changeObj = setMetaChildren(obj, child)
              return changeObj
            })
            return {
              label: templateObj[meta.type],
              key: meta.type,
              type: 'group',
              children,
            }
          })
        arr.push(...metaArr)
      }
      const metaFlowNodes = props?.metaFlow?.metaFlowNodes
      if (metaFlowNodes) {
        metaFlowNodes.forEach((record) => {
          if (record.type === FlowMetaType.RECORD_LOOKUP) {
            if (
              !record.callArguments?.outputAssignments &&
              (record.callArguments?.storeOutputAutomatically ||
                (record.callArguments?.queriedFields &&
                  !record.callArguments?.outputReference))
            ) {
              const register = props?.metaFlow?.registers?.find(
                (reg) => reg.id === record.registerId
              )
              const registerOps = []
              const resourceData: any = {
                labelName: `来自${record.id}的 ${register.name}`,
                label: itemLabelName(record, register),
                webType: record.getFirstRecordOnly
                  ? FlowResourceType.VARIABLE_RECORD
                  : FlowResourceType.VARIABLE_ARRAY_RECORD,
                dataType: record.getFirstRecordOnly
                  ? MetaValueType.OBJECT_ID
                  : MetaValueType.ARRAY,
                key: record.id,
                refRegisterId: register?.id,
                children: registerOps,
              }
              if (register?.properties) {
                for (const key in register.properties) {
                  if (register.properties.hasOwnProperty(key)) {
                    const obj = register.properties[key]
                    const p = {
                      label: itemLabelName(obj),
                      labelName: obj.name,
                      key: obj.id || obj.key,
                      dataType: obj.type,
                      children: [],
                    }
                    const changeObj = setMetaChildren(p, obj)
                    registerOps.push(changeObj)
                  }
                }
              }
              if (resourceData.type === MetaValueType.ARRAY) {
                resourceData.items = {
                  type: MetaValueType.OBJECT,
                  properties: null,
                }
              }
              const p: any = arr.find(
                (m: any) => m.key === resourceData.webType && m.type
              )
              if (p) {
                p?.children?.push(resourceData)
              } else {
                const obj: any = {
                  label: templateObj[resourceData.webType],
                  key: resourceData.webType,
                  type: 'group',
                  children: [resourceData],
                }
                arr.push(obj)
              }
            }
          }
        })
      }
      const objectRegister = props?.metaFlow?.registers?.find(
        (reg) => reg.id === props?.metaFlow?.recordObject?.objectId
      )
      if (
        objectRegister?.properties &&
        (!props?.flowJsonTypes || props.isShowGlobal)
      ) {
        const registerOps = []
        const option = [
          {
            label: '$RECORD',
            key: '$RECORD',
            children: registerOps,
          },
        ]
        for (const key in objectRegister.properties) {
          if (objectRegister.properties.hasOwnProperty(key)) {
            const obj = objectRegister.properties[key]
            const p = {
              label: itemLabelName(obj),
              labelName: obj.name,
              key: obj.id || obj.key,
              dataType: obj.type,
              children: [],
            }
            const changeObj = setMetaChildren(p, obj)
            registerOps.push(changeObj)
          }
        }
        arr.push({
          label: templateObj[FlowResourceType.GLOBAL_VARIABLE],
          key: FlowResourceType.GLOBAL_VARIABLE,
          type: 'group',
          children: option,
        } as any)
      }
      setItems(arr)
      setHistoryItems(arr)
      setFlag(false)
    }
  }, [
    props?.metaFlow?.metaResourceDatas,
    props?.metaFlow?.registers,
    props?.metaFlow?.recordObject?.objectId,
    props?.sourceMode,
    props?.flowJsonTypes,
    props.objectKey,
    props.isShowGlobal,
    props?.registerOpType,
    props?.metaFlow?.metaFlowNodes,
  ])

  const setMetaChildren = useCallback(
    (obj: any, meta: IFieldMeta) => {
      if (props.rank === 'single') {
        delete obj?.children
        return obj
      }
      if (meta.properties && isObj(meta.properties)) {
        for (const proKey in meta.properties) {
          if (meta.properties.hasOwnProperty(proKey)) {
            const p: any = meta.properties[proKey]
            const child = {
              label: itemLabelName(p),
              labelName: p.name,
              key: p.id || p.key,
              dataType: p.type,
              parentType: p.webType,
              children: [],
            }
            if (props?.registerOpType) {
              const bool = p[props?.registerOpType]
              if (isBool(bool) && bool) {
                setMetaChildren(child, p)
                if (child?.children?.length === 0) {
                  delete child?.children
                }
                obj?.children?.push(child)
              }
            } else {
              setMetaChildren(child, p)
              if (child?.children?.length === 0) {
                delete child?.children
              }
              obj?.children?.push(child)
            }
          }
        }
        if (obj?.children?.length === 0) delete obj?.children
        return obj
      } else {
        if (obj?.children?.length === 0) delete obj?.children
        return obj
      }
    },
    [props.rank, props?.registerOpType]
  )

  const itemLabelName = useCallback((item, register?: any) => {
    return (
      <div style={{ lineHeight: '15px', display: 'inline-block' }}>
        {!register ? (
          <div>{item.name}</div>
        ) : (
          <div>{`来自${item.id}的 ${register.name}`}</div>
        )}
        <div style={{ fontSize: '12px', color: '#ccc' }}>
          {metaDataOps[item.type]}
        </div>
      </div>
    )
  }, [])

  const createResource = useCallback(() => {
    resourceEdit(props.metaFlow, false)
  }, [props.metaFlow])

  const changeValue = useCallback(
    (e) => {
      const val: string = e.target.value
      const lowerVal = val.toLowerCase()
      setVariable(true)
      setInputValue(val)
      const list = clone(historyItems)
      if (val?.length > 0) {
        const arrs = list.filter((item: any) => {
          if (item?.type === 'group') {
            const childs = item?.children?.filter((child) => {
              const lowerLabel = child.labelName?.toLowerCase()
              return lowerLabel?.indexOf(lowerVal) > -1
            })
            if (childs.length > 0) {
              item.children = childs
              return childs
            }
            return false
          } else {
            const lowerLabel = item.labelName?.toLowerCase()
            return lowerLabel?.indexOf(lowerVal) > -1
          }
        })
        setItems(arrs)
        setSelectKeys([])
      } else {
        setItems(list)
        setSelectKeys([])
      }
    },
    [historyItems]
  )

  const changeBlur = useCallback(() => {
    if (selectKeys.length === 0 && !props.isInput) {
      setInputValue('')
      onChange(undefined)
    } else {
      onChange(inputValue)
    }
  }, [selectKeys, props.isInput])

  const onClick: MenuProps['onClick'] = (e: any) => {
    setVariable(false)
    setItems(historyItems)
    if (e.key === '0') {
      createResource()
    } else {
      const target: any = e.domEvent.target
      const { dataType, parentType, labelName } = e?.item?.props
      setSelectKeys(e.keyPath)
      setInputValue(labelName ?? '')
      onChange(e.keyPath, parentType)
      if (props?.isSetType) onChangeTypeValue(dataType)
    }
  }

  const reactionTypeKey = useMemo(() => {
    const arr = clone(reactionPath)
    arr.push(props?.reactionTypeKey)
    return arr
  }, [reactionPath, props?.reactionTypeKey])

  const onChangeTypeValue = useCallback(
    (dataType: any) => {
      const arr = clone(reactionPath)
      arr.push(props?.typeKey)
      form.setFieldState(arr.join('.'), (state) => {
        state.value = dataType
        formilyField.validate()
      })
    },
    [reactionPath, props?.typeKey]
  )

  const handleClose = () => {
    // const newTags = selectKeys.filter((tag) => tag !== removedTag)
    setInputValue('')
    onChange(undefined)
    setVariable(true)
    setSelectKeys([])
  }

  const tagChild = useCallback(() => {
    const tagElem = (
      <Tag
        closable={!disabled}
        onClose={(e) => {
          //   e.preventDefault()
          if (!disabled) handleClose()
        }}
      >
        {inputValue}
      </Tag>
    )
    return (
      <span key={1} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    )
  }, [inputValue, disabled])

  const initData = useCallback(
    (isVar: boolean, selectKeys: string[]) => {
      const length = selectKeys.length
      if (length > 0 && !inputValue) {
        const selectKey = selectKeys[0]
        let value = null
        historyItems.some((item) => {
          if (item.id === selectKey || item.key === selectKey) {
            value = item.labelName
            if (props?.isSetType) onChangeTypeValue(item.dataType)
            if (value) setInputValue(value)
            return true
          }
          if (item?.children?.length > 0) {
            value = findName(item?.children, selectKey, length)
            setInputValue(value)
            return value
          }
        })
        if (!value) {
          setSelectKeys([])
          setInputValue(selectKeys?.reverse()?.join('.'))
          if (isVar) setInputType(InputtypeEnum.FORMULA)
        } else {
          setInputType(InputtypeEnum.BASE)
        }
      }
    },
    [historyItems, inputValue, props?.isSetType]
  )

  const findName = (
    children: any[],
    selectKey: string,
    length: number,
    name = ''
  ) => {
    const num = length - 1
    children.some((child) => {
      if (num === 0) {
        if (child.id === selectKey || child.key === selectKey) {
          name = child.labelName
          if (props?.isSetType) onChangeTypeValue(child.dataType)
          return true
        }
      } else if (child?.children?.length > 0 && num > 0) {
        name = findName(child?.children, selectKey, num, name)
      }
    })
    return name
  }

  const isFormula = useMemo(() => props.isFormula, [props.isFormula])

  return (
    <div ref={ref} style={props.style}>
      {inputType === InputtypeEnum.BASE ? (
        <Dropdown
          open={visible}
          onOpenChange={() => {
            setVariable(!disabled ? !visible : false)
            // if (!visible) openSelect()
          }}
          overlayClassName="resource-select-list"
          menu={{
            items,
            onClick,
            selectable: true,
            selectedKeys: selectKeys,
            defaultSelectedKeys: selectKeys,
          }}
          trigger={['click']}
          destroyPopupOnHide={true}
        >
          <a
            onClick={(e) => {
              // if (!disabled) setVariable(true)
              e.stopPropagation()
            }}
          >
            <div style={{ width: '100%' }}>
              {selectKeys.length > 0 ? (
                <div className="resource-select-formula">
                  <div
                    className={`resource-select-custom-input ${
                      disabled ? 'disabled' : ''
                    }`}
                  >
                    {tagChild()}
                  </div>
                  {isFormula && (
                    <span
                      className={`resource-select-formula-check ${
                        disabled ? 'disable' : ''
                      }`}
                      onClick={(e) => {
                        if (!disabled) {
                          e.stopPropagation()
                          changeInputType(InputtypeEnum.FORMULA)
                        }
                      }}
                    >
                      <SettingOutlined />
                    </span>
                  )}
                </div>
              ) : (
                <div className="resource-select-formula">
                  <Input
                    allowClear
                    suffix={<SearchOutlined />}
                    onChange={changeValue}
                    value={inputValue}
                    placeholder={props.placeholder}
                    onBlur={changeBlur}
                    disabled={disabled}
                  />
                  {isFormula && (
                    <span
                      className={`resource-select-formula-check ${
                        disabled ? 'disable' : ''
                      }`}
                      onClick={(e) => {
                        if (!disabled) {
                          e.stopPropagation()
                          changeInputType(InputtypeEnum.FORMULA)
                        }
                      }}
                    >
                      <SettingOutlined />
                    </span>
                  )}
                </div>
              )}
            </div>
          </a>
        </Dropdown>
      ) : (
        <div className="resource-select-formula">
          <FormulaModel
            metaFlow={props.metaFlow}
            valueType={'string' as any}
            value={selectKeys.length > 0 ? cloneDeep(selectKeys) : inputValue}
            disabled={disabled}
            onChange={(value: string) => onChangeValue(value)}
          />
          <span
            className={`resource-select-formula-check ${
              disabled ? 'disable' : ''
            }`}
            onClick={() => {
              if (!disabled) {
                changeInputType(InputtypeEnum.BASE)
              }
            }}
          >
            <SettingOutlined />
          </span>
        </div>
      )}
    </div>
  )
})
