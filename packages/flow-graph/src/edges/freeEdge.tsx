import {
  MarkerType,
  useStore,
  getStraightPath,
  getSmoothStepPath,
} from 'reactflow'
import React, { useCallback } from 'react'
import { getEdgeParams } from './util'

export const freeEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'freeEdge',
  // type: 'fixEdge',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
}

export const FreeEdge = ({ id, source, target, markerEnd, style }: any) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  )
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  )

  if (!sourceNode || !targetNode) {
    return null
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode)

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  })

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  )
}
