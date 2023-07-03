import React, { FC, useCallback, useMemo, useState } from 'react'
import { Input } from '@formily/antd'
import { Input as antInput, message } from 'antd'
import { useForm, observer, useField } from '@formily/react'
import { useLocale } from '@toy-box/studio-base'

export const InputUrl: FC = observer((props: any) => {
  const form = useForm()
  const formilyField = useField() as any
  const [urlVal, setUrlVal] = useState(props.value)

  const changeValue = useCallback(
    (e: any) => {
      form.setFieldState(formilyField?.path?.entire, (state) => {
        const val = e.target.value
        const len = val.length
        const idx = val.indexOf('?')
        if (idx >= 0) {
          message.destroy()
          const copyVal = val.slice(0, idx)
          setUrlVal(copyVal)
          state.value = copyVal
          message.info({
            content: useLocale(
              'flowDesigner.flow.form.httpCalls.message.query'
            ),
            style: {
              marginTop: '30vh',
            },
          })
          // if (idx === (len - 1)) {

          // } else {
          //   message.info({
          //     content: '路径中 Query 参数已自动提取，并填充到下方参数中',
          //     style: {
          //       marginTop: '30vh',
          //     },
          //   })
          // }
        } else {
          setUrlVal(val)
          state.value = val
        }
      })
    },
    [form]
  )
  return (
    <Input
      placeholder={useLocale(
        'flowDesigner.flow.form.placeholder.formilyInput.input'
      )}
      onChange={changeValue}
      value={urlVal}
    />
  )
})
