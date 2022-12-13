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
  markerEnd,
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
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
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
        markerEnd={markerEnd}
      />
    </>
  )
}
