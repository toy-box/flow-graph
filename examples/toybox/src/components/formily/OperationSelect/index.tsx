import React, { FC, useCallback, useMemo } from 'react'
import { observer } from '@formily/reactive-react'
import { useLocale } from '@toy-box/studio-base'
import { FieldSelect } from '@toy-box/meta-components'
import { MetaValueType } from '@toy-box/meta-schema'
import { useField, useForm } from '@formily/react'
import { FlowResourceType } from '@toy-box/autoflow-core'
import { AssignmentOpEnum } from '../../../interface'

export const OperationSelect: FC = observer((props: any) => {
  const form = useForm()
  const field = useField() as any

  const textOps = [
    {
      label: useLocale('flowDesigner.flow.metaValueType.assign'),
      value: AssignmentOpEnum.ASSIGN,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.add'),
      value: AssignmentOpEnum.ADD,
    },
  ]
  const numOps = [
    {
      label: useLocale('flowDesigner.flow.metaValueType.assign'),
      value: AssignmentOpEnum.ASSIGN,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.add'),
      value: AssignmentOpEnum.ADD,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.subtract'),
      value: AssignmentOpEnum.SUBTRACT,
    },
  ]
  const eqOps = [
    {
      label: useLocale('flowDesigner.flow.metaValueType.assign'),
      value: AssignmentOpEnum.ASSIGN,
    },
  ]
  const varArrayOps = [
    {
      label: useLocale('flowDesigner.flow.metaValueType.assign'),
      value: AssignmentOpEnum.ASSIGN,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.add'),
      value: AssignmentOpEnum.ADD,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.addAtStart'),
      value: AssignmentOpEnum.ADD_AT_START,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.removeFirst'),
      value: AssignmentOpEnum.REMOVE_FIRST,
    },
    {
      label: useLocale('flowDesigner.flow.metaValueType.removeAll'),
      value: AssignmentOpEnum.REMOVE_ALL,
    },
  ]
  const operatOptions = [
    {
      type: FlowResourceType.VARIABLE,
      children: [
        { type: MetaValueType.STRING, children: textOps },
        { type: MetaValueType.TEXT, children: textOps },
        { type: MetaValueType.NUMBER, children: numOps },
        { type: MetaValueType.BOOLEAN, children: eqOps },
        { type: MetaValueType.DATE, children: numOps },
        { type: MetaValueType.DATETIME, children: eqOps },
      ],
    },
    {
      type: FlowResourceType.VARIABLE_RECORD,
      children: [
        { type: MetaValueType.OBJECT_ID, children: eqOps },
        { type: MetaValueType.OBJECT, children: eqOps },
      ],
    },
    {
      type: FlowResourceType.VARIABLE_ARRAY,
      children: [
        { type: MetaValueType.STRING, children: varArrayOps },
        { type: MetaValueType.TEXT, children: varArrayOps },
        { type: MetaValueType.NUMBER, children: varArrayOps },
        { type: MetaValueType.BOOLEAN, children: varArrayOps },
        { type: MetaValueType.DATE, children: varArrayOps },
        { type: MetaValueType.DATETIME, children: varArrayOps },
        { type: MetaValueType.ARRAY, children: varArrayOps },
      ],
    },
    {
      type: FlowResourceType.VARIABLE_ARRAY_RECORD,
      children: [{ type: MetaValueType.ARRAY, children: varArrayOps }],
    },
  ]

  const handleSelectOptions = useCallback(
    (value: any) => {
      form.setFieldState(field?.path?.entire, (state) => {
        state.value = value
      })
    },
    [form]
  )
  const index = useMemo(() => {
    const entire = field?.path?.entire.split('.')
    return entire?.[1]
  }, [field?.path?.entire])

  const operatOps = useMemo(() => {
    const reactionValue =
      form.values?.[props?.reactionObj?.key]?.[index]?.[
        props?.reactionObj?.value
      ]
    if (reactionValue) {
      return textOps
    }
    return false
  }, [
    form.values?.[props?.reactionObj?.key]?.[index]?.[
      props?.reactionObj?.value
    ],
  ])

  return (
    <FieldSelect
      placeholder={props.placeholder}
      options={operatOps || []}
      field={{
        type: 'op',
        key: 'op',
        name: useLocale(
          'flowDesigner.flow.form.placeholder.formilyInput.record'
        ),
      }}
      disabled={!operatOps}
      value={props.value}
      onChange={handleSelectOptions}
    />
  )
})
