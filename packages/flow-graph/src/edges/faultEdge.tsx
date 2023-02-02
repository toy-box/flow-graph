import {
  MarkerType,
  useStore,
  getSmoothStepPath,
  BaseEdge,
  DefaultEdgeOptions,
} from 'reactflow'
import React, { useCallback } from 'react'
import { getEdgeParams } from './util'

export const FaultEdge = ({
  id,
  source,
  target,
  markerEnd = 'faultHoverArrow',
  style = { strokeWidth: 5, stroke: 'rgb(145, 146, 151)' },
  label,
  labelStyle = { fontWeight: 'bolder' },
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius = 4,
  data,
}: any) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  )
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  )

  if (!sourceNode || !targetNode) {
    return null
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  )

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX:
      sourcePos === 'left' ? sx - 10 : sourcePos === 'right' ? sx + 10 : sx,
    sourceY:
      sourcePos === 'top' ? sy - 10 : sourcePos === 'bottom' ? sy + 10 : sy,
    targetX:
      targetPos === 'left' ? tx - 10 : targetPos === 'right' ? tx + 10 : tx,
    targetY:
      targetPos === 'top' ? ty - 10 : targetPos === 'bottom' ? ty + 10 : ty,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
  })

  const faultEdgeStyle = {
    stroke: 'rgb(194, 57, 52)',
    strokeWidth: 2,
    strokeDasharray: [8, 12],
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        labelX={labelX}
        labelY={labelY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
        style={faultEdgeStyle}
      />
    </>
  )
}
