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

export const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'black',
}

export const FreeEdge = ({
  id,
  source,
  target,
  markerEnd,
  style,
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

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      {/* <text>
        <textPath
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#ffcc00",
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700
          }}
          className="nodrag nopan"
        >
          {data.text}
        </div>
        </textPath>
      </text> */}
      {/* <text>
      <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: "#ffcc00",
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700
          }}
          className="nodrag nopan"
        >
          {data.text}
        </div>
      </text> */}
    </>
  )
}
