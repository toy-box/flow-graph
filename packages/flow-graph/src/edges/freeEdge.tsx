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
  // markerEnd: {
  //   type: MarkerType.ArrowClosed,
  // },
  markerEnd: 'myArrowClosed',
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
  // const newEdgeArray = edgePath.split(' ')
  // newEdgeArray[newEdgeArray.length-1] = Number(newEdgeArray[newEdgeArray.length-1]) - 10 + ''
  // console.log('edgePath', newEdgeArray.join(' '))

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
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      /> */}
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
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffcc00',
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {label}
        </textPath>
      </text> */}
      {/* <div           style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffcc00',
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
          className="nodrag nopan">{label}</div> */}
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
