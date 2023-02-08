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
import { clone } from '@formily/shared'
import { useField, useForm } from '@formily/react'
import { useFreeFlow } from '@toy-box/flow-node'
import { FreeFlow } from '@toy-box/autoflow-core'
import { resourceEdit } from '../../../flow-nodes'
import './index.less'

export const ResourceSelect: FC = observer((props: any) => {
  const form = useForm()
  const formilyField = useField() as any
  const [visible, setVariable] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectKeys, setSelectKeys] = useState([])
  const ref = useRef()
  const [items, setItems] = useState<MenuProps['items']>([
    {
      key: '1',
      type: 'group',
      label: 'Group title',
      children: [
        {
          key: '1-1',
          label: '1st menu item',
        },
        {
          key: '1-2',
          label: '2nd menu item',
        },
      ],
    },
    {
      key: '2',
      label: 'sub menu',
      onTitleClick: (e) => {
        // setVariable(true)
        e.domEvent.stopPropagation()
      },
      children: [
        {
          key: '2-1',
          label: '3rd menu item',
          onTitleClick: (e) => {
            // setVariable(true)
            e.domEvent.stopPropagation()
          },
          children: [
            {
              key: '2-1-1',
              label: 'rd menu item',
            },
            {
              key: '2-1-2',
              label: '42-1th menu item',
            },
          ],
        },
        {
          key: '2-2',
          label: '4th menu item',
        },
      ],
    },
  ])
  const [historyItems, setHistoryItems] = useState([])

  const onChange = useCallback(
    (value: string) => {
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
    const arr = items
    // const metaResourceDatas = props?.metaFlow?.metaResourceDatas
    // metaResourceDatas.filter(source => {
    //     if (source.children.length > 0) return true
    // }).map(meta => {
    //     meta.children.map(() => {

    //     })
    //     return {
    //         label: meta.type,
    //         key: meta.type,
    //         type: 'group',
    //         children:
    //     }
    // })
    arr.unshift({
      key: '0',
      label: '新建 资源',
      icon: <PlusOutlined />,
    })
    setItems(arr)
    setHistoryItems(arr)
  }, [])

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
      onChange('')
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
      onChange(target?.innerText)
    }
  }

  const handleClose = () => {
    // const newTags = selectKeys.filter((tag) => tag !== removedTag)
    setInputValue('')
    onChange('')
    setSelectKeys([])
  }

  const tagChild = () => {
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
  }

  return (
    <div ref={ref}>
      <Dropdown
        open={visible}
        onOpenChange={() => setVariable(!visible)}
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
