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
import { IFieldMeta } from '@toy-box/meta-schema'
import { useLocale } from '@toy-box/studio-base'
import { FlowResourceType } from '@toy-box/autoflow-core'
import get from 'lodash.get'
import { isArr } from '@designable/shared'
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
  const [inputValue, setInputValue] = useState('')
  const [selectKeys, setSelectKeys] = useState([])
  const [inputType, setInputType] = useState(InputtypeEnum.BASE)
  const ref = useRef()
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

  useEffect(() => {
    const val = formilyField?.value
    const len = val?.length
    if (isStr(val) && val.startsWith('{!') && val.endsWith('}')) {
      const newVal = val.slice(2, len - 1)
      setInputType(InputtypeEnum.FORMULA)
      setInputValue(newVal)
    } else if (isStr(val) && val.startsWith('{{') && val.endsWith('}}')) {
      const newVal = val.slice(2, len - 2)
      setSelectKeys(newVal?.split('.')?.reverse() || [])
    } else {
      if (val) {
        setSelectKeys(val?.split('.')?.reverse())
      } else {
        setSelectKeys([])
        setInputValue(null)
      }
    }
  }, [formilyField?.value])

  const onChange = useCallback(
    (value: string[] | string, parentType?: FlowResourceType) => {
      form.setFieldState(formilyField?.path?.entire, (state) => {
        let val = value
        if (isArr(value)) val = value?.reverse()?.join('.')
        state.value = val
        formilyField.validate()
      })
    },
    [form, formilyField]
  )

  const onChangeValue = useCallback(
    (value: string) => {
      form.setFieldState(formilyField?.path?.entire, (state) => {
        state.value = `{!${value}}`
        formilyField.validate()
      })
    },
    [form, formilyField]
  )

  const changeInputType = useCallback((type: InputtypeEnum) => {
    setInputValue('')
    setInputType(type)
    setSelectKeys([])
  }, [])

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
                    label: obj.name,
                    key: obj.key,
                    dataType: obj.type,
                    children: [],
                  }
                  const changeObj = setMetaChildren(option, obj)
                  registerOps.push(changeObj)
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
              label: r.name,
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
                label: child.name,
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
              label: obj.name,
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
    }
  }, [
    props?.metaFlow?.metaResourceDatas,
    props?.metaFlow?.registers,
    props?.metaFlow?.recordObject?.objectId,
    props?.sourceMode,
    props?.flowJsonTypes,
    props.objectKey,
    props.isShowGlobal,
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
              label: p.name,
              key: p.id || p.key,
              dataType: p.type,
              parentType: p.webType,
              children: [],
            }
            setMetaChildren(child, p)
            if (child?.children?.length === 0) {
              delete child?.children
            }
            obj?.children?.push(child)
          }
        }
        if (obj?.children?.length === 0) delete obj?.children
        return obj
      } else {
        if (obj?.children?.length === 0) delete obj?.children
        return obj
      }
    },
    [props.rank]
  )

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
      const arrs = list.filter((item: any) => {
        if (item?.type === 'group') {
          const childs = item?.children?.filter((child) => {
            const lowerLabel = child.label.toLowerCase()
            return lowerLabel.indexOf(lowerVal) > -1
          })
          if (childs.length > 0) {
            item.children = childs
            return childs
          }
          return false
        } else {
          const lowerLabel = item.label.toLowerCase()
          return lowerLabel.indexOf(lowerVal) > -1
        }
      })
      setItems(arrs)
      setSelectKeys([])
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
      const { dataType, parentType } = e?.item?.props
      setSelectKeys(e.keyPath)
      setInputValue(target?.innerText ?? '')
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

  useEffect(() => {
    const length = selectKeys.length
    if (length > 0 && !inputValue) {
      const selectKey = selectKeys[0]
      let value = null
      historyItems.some((item) => {
        if (item.id === selectKey || item.key === selectKey) {
          value = item.label
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
        setInputValue(selectKey)
      }
    }
  }, [historyItems, selectKeys, inputValue])

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
          name = child.label
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
                <div
                  className={`resource-select-custom-input ${
                    disabled ? 'disabled' : ''
                  }`}
                >
                  {tagChild()}
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
            value={inputValue}
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
