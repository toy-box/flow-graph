import {
  MarkerType,
  useStore,
  getSmoothStepPath,
  BaseEdge,
  DefaultEdgeOptions,
} from 'reactflow'
import React, { useCallback } from 'react'
import { getEdgeParams } from './util'

export const freeEdgeOptions: DefaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: 'rgb(145, 146, 151)' },
  type: 'freeEdge',
  // type: 'fixEdge',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  labelBgPadding: [8, 4],
  labelBgBorderRadius: 4,
  labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 1 },
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
        style={style}
        markerEnd={markerEnd}
      />
      {/* <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      /> */}
      {/* <text>
        <textPath
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {data.text}
        </textPath>
      </text> */}
      {/* <div>{data.text}</div> */}
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
