import React, { FC, useCallback, useMemo } from 'react'
import { observer } from '@formily/reactive-react'
import { useLocale } from '@toy-box/studio-base'
import { FieldSelect } from '@toy-box/meta-components'
import { CompareOP, MetaValueType } from '@toy-box/meta-schema'
import { useField, useForm } from '@formily/react'
import { FlowResourceType } from '@toy-box/autoflow-core'
import { clone } from '@designable/shared'
import get from 'lodash.get'
import { AssignmentOpEnum } from '../../../interface'

export const OperationSelect: FC = observer((props: any) => {
  const form = useForm()
  const field = useField() as any

  const numberOps = [
    CompareOP.EQ,
    CompareOP.NE,
    CompareOP.GT,
    CompareOP.LT,
    CompareOP.GTE,
    CompareOP.LTE,
    CompareOP.IS_NULL,
  ]

  const dateOps = [
    CompareOP.UNIT_DATE_RANGE,
    CompareOP.BETWEEN,
    CompareOP.EQ,
    CompareOP.NE,
    CompareOP.GT,
    CompareOP.LT,
    CompareOP.GTE,
    CompareOP.LTE,
    CompareOP.IS_NULL,
  ]

  const stringOps = [
    CompareOP.EQ,
    CompareOP.NE,
    CompareOP.IN,
    CompareOP.NIN,
    CompareOP.GT,
    CompareOP.LT,
    CompareOP.GTE,
    CompareOP.LTE,
    CompareOP.LIKE,
    CompareOP.IS_NULL,
  ]

  const optionOps = [
    CompareOP.EQ,
    CompareOP.NE,
    CompareOP.IN,
    CompareOP.NIN,
    CompareOP.IS_NULL,
  ]

  const optionMultiOps = [CompareOP.EQ, CompareOP.IN, CompareOP.NIN]

  const booleanOps = [CompareOP.EQ, CompareOP.NE, CompareOP.IS_NULL]

  const FieldOpMap: Record<string, Array<Toybox.MetaSchema.Types.CompareOP>> = {
    [MetaValueType.INTEGER]: numberOps,
    [MetaValueType.NUMBER]: numberOps,
    [MetaValueType.STRING]: stringOps,
    [MetaValueType.TEXT]: stringOps,
    [MetaValueType.BOOLEAN]: booleanOps,
    [MetaValueType.DATE]: dateOps,
    [MetaValueType.DATETIME]: dateOps,
    [MetaValueType.TIMESTAMP]: dateOps,
    [MetaValueType.SINGLE_OPTION]: optionOps,
    [MetaValueType.MULTI_OPTION]: optionMultiOps,
    [MetaValueType.OBJECT_ID]: optionOps,
    [MetaValueType.OBJECT]: optionOps,
    [MetaValueType.ARRAY]: optionOps,
  }

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

  const handleSelectOptions = useCallback(
    (value: any) => {
      form.setFieldState(field?.path?.entire, (state) => {
        state.value = value
      })
    },
    [form]
  )
  const reactionPath = useMemo(() => {
    const segments = field?.path?.segments
    const length = segments?.length
    const arr = segments.slice(0, length - 1)
    return arr
  }, [field?.path?.segments])

  const reactionKey = useMemo(() => {
    const arr = clone(reactionPath)
    arr.push(props?.reactionKey)
    return arr
  }, [reactionPath, props?.reactionKey])

  const reactionTypeKey = useMemo(() => {
    const arr = clone(reactionPath)
    arr.push(props?.reactionTypeKey)
    return arr
  }, [reactionPath, props?.reactionTypeKey])

  const operatOps = useMemo(() => {
    const reactionValue = get(form.values, reactionKey)
    const reactionTypeValue = get(form.values, reactionTypeKey)
    if (reactionValue) {
      if (props?.isAssignment) {
        switch (reactionTypeValue) {
          case MetaValueType.STRING:
          case MetaValueType.TEXT:
            return textOps
          case MetaValueType.NUMBER:
          case MetaValueType.DATE:
            return numOps
          case MetaValueType.BOOLEAN:
          case MetaValueType.DATETIME:
          case MetaValueType.OBJECT_ID:
          case MetaValueType.OBJECT:
            return eqOps
          case MetaValueType.ARRAY:
            return varArrayOps
          default:
            return textOps
        }
      } else if (reactionTypeValue) {
        const compareOperation = FieldOpMap[reactionTypeValue]
        const compareOperations = compareOperation?.map((op) => {
          return {
            label: useLocale(`flowDesigner.compareOperation.${op}`),
            value: op,
          }
        })
        return compareOperations
      }
    }
    return false
  }, [get(form.values, reactionKey, reactionTypeKey, props?.isAssignment)])

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
