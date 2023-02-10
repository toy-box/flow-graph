import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Input, Tag } from 'antd'
import { observer } from '@formily/reactive-react'
import { clone, isObj } from '@formily/shared'
import { useField, useForm } from '@formily/react'
import { IFieldMeta } from '@toy-box/meta-schema'
import { useLocale } from '@toy-box/studio-base'
import { FlowResourceType } from '@toy-box/autoflow-core'
import { resourceEdit } from '../../../flow-nodes'
import './index.less'

export const ResourceSelect: FC = observer((props: any) => {
  const form = useForm()
  const formilyField = useField() as any
  const [visible, setVariable] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectKeys, setSelectKeys] = useState(formilyField.value || [])
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
  }

  const onChange = useCallback(
    (value: string[]) => {
      form.setFieldState(formilyField?.path?.entire, (state) => {
        state.value = value
        formilyField.validate()
      })
    },
    [form, formilyField]
  )

  const index = useMemo(() => {
    const entire = formilyField?.path?.entire.split('.')
    return entire?.[1]
  }, [formilyField?.path?.entire])

  const disabled = useMemo(() => {
    const reactionValue =
      form.values?.[props?.reactionObj?.key]?.[index]?.[
        props?.reactionObj?.value
      ]
    if (props?.reactionObj) {
      return !reactionValue
    }
    return false
  }, [
    form.values?.[props?.reactionObj?.key]?.[index]?.[
      props?.reactionObj?.value
    ],
  ])

  useEffect(() => {
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
          if (source.children.length > 0) return true
        })
        .map((meta) => {
          const children = meta.children.map((child) => {
            const obj = {
              label: child.name,
              key: child.key,
              // children: [],
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
    setItems(arr)
    setHistoryItems(arr)
  }, [props?.metaFlow?.metaResourceDatas])

  const setMetaChildren = (obj: any, meta: IFieldMeta) => {
    if (meta.properties && isObj(meta.properties)) {
      for (const proKey in meta.properties) {
        if (meta.properties.hasOwnProperty(proKey)) {
          const p = meta.properties[proKey]
          const child = {
            label: p.name,
            key: p.key,
            children: [],
          }
          setMetaChildren(child, p)
          obj.children.push(child)
        }
      }
    } else {
      return obj
    }
  }

  const createResource = useCallback(() => {
    resourceEdit(props.metaFlow, false)
  }, [])

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
    if (selectKeys.length === 0) {
      setInputValue('')
      onChange(undefined)
    }
  }, [selectKeys])

  const onClick: MenuProps['onClick'] = (e) => {
    setVariable(false)
    setItems(historyItems)
    if (e.key === '0') {
      createResource()
    } else {
      const target: any = e.domEvent.target
      setSelectKeys(e.keyPath)
      setInputValue(target?.innerText ?? '')
      onChange(e.keyPath)
    }
  }

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
    if (length > 0) {
      const selectKey = selectKeys[0]
      historyItems.some((item) => {
        if (item.key === selectKey) return setInputValue(item.label)
        if (item?.children?.length > 0) {
          return setInputValue(findName(item?.children, selectKey, length))
        }
      })
    }
  }, [historyItems, selectKeys])

  const findName = useCallback(
    (children: any[], selectKey: string, length: number) => {
      const num = length - 1
      let name = ''
      children.some((child) => {
        if (num === 0) {
          if (child.key === selectKey) {
            name = child.label
            return true
          }
        } else if (child?.children?.length > 0) {
          findName(child?.children, selectKey, num)
        }
      })
      return name
    },
    []
  )

  return (
    <div ref={ref}>
      <Dropdown
        open={visible}
        onOpenChange={() => {
          setVariable(!disabled ? !visible : false)
          // if (!visible) openSelect()
        }}
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
              <div className="resource-select-custom-input">{tagChild()}</div>
            ) : (
              <Input
                allowClear
                suffix={<SearchOutlined />}
                onChange={changeValue}
                value={inputValue}
                placeholder={props.placeholder}
                onBlur={changeBlur}
                disabled={disabled}
              />
            )}
          </div>
        </a>
      </Dropdown>
    </div>
  )
})
