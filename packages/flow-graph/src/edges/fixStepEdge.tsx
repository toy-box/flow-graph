import React, { memo } from 'react';
import {
  BaseEdge,
  EdgeProps,
  SmoothStepPathOptions,
  Position,
  XYPosition,
} from 'reactflow';

export interface GetFixStepPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  borderRadius?: number;
  centerX?: number;
  centerY?: number;
  offset?: number;
  sourceXSet?: number;
  sourceYSet?: number;
  targetXSet?: number;
  targetYSet?: number;
  vertices?: XYPosition[];
}

export interface FixStepEdgeData {
  vertices?: XYPosition[];
  sourceXSet?: number;
  sourceYSet?: number;
  targetXSet?: number;
  targetYSet?: number;
}

export interface FixStepEdgeProps<T = FixStepEdgeData> extends EdgeProps<T> {
  pathOptions?: SmoothStepPathOptions;
}

const handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
};

const getEdgeCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): [number, number, number, number] => {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
};

const getDirection = ({
  source,
  sourcePosition = Position.Bottom,
  target,
}: {
  source: XYPosition;
  sourcePosition: Position;
  target: XYPosition;
}): XYPosition => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};

const distance = (a: XYPosition, b: XYPosition) =>
  Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

// ith this function we try to mimic a orthogonal edge routing behaviour
// It's not as good as a real orthogonal edge routing but it's faster and good enough as a default for step and smooth step edges
function getPoints({
  source,
  sourcePosition = Position.Bottom,
  target,
  targetPosition = Position.Top,
  center,
  offset,
  sourceXSet,
  sourceYSet,
  targetXSet,
  targetYSet,
}: {
  source: XYPosition;
  sourcePosition: Position;
  target: XYPosition;
  targetPosition: Position;
  center: Partial<XYPosition>;
  offset: number;
  sourceXSet: number;
  sourceYSet: number;
  targetXSet: number;
  targetYSet: number;
}): [XYPosition[], number, number, number, number] {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped: XYPosition = {
    x: source.x + sourceDir.x * offset + sourceXSet,
    y: source.y + sourceDir.y * offset + sourceYSet,
  };
  const targetGapped: XYPosition = {
    x: target.x + targetDir.x * offset + targetXSet,
    y: target.y + targetDir.y * offset + targetYSet,
  };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped,
  });
  const dirAccessor = dir.x !== 0 ? 'x' : 'y';
  const currDir = dir[dirAccessor];

  let points: XYPosition[] = [];
  let centerX: number, centerY: number;

  const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] =
    getEdgeCenter({
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
    });

  // opposite handle positions, default case
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    centerX = center.x || defaultCenterX;
    centerY = (center.y || defaultCenterY) - offset;
    //    --->
    //    |
    // >---
    const verticalSplit: XYPosition[] = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y },
    ];
    //    |
    //  ---
    //  |
    const horizontalSplit: XYPosition[] = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY },
    ];

    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
    }
    if (sourceDir[dirAccessor] === currDir) centerX = targetGapped.x;
    centerY = centerY + offset * 2.5;
  } else {
    // sourceTarget means we take x from source and y from target, targetSource is the opposite
    const sourceTarget: XYPosition[] = [
      { x: sourceGapped.x, y: targetGapped.y },
    ];
    const targetSource: XYPosition[] = [
      { x: targetGapped.x, y: sourceGapped.y },
    ];
    // this handles edges with same handle positions
    if (dirAccessor === 'x') {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }

    // these are conditions for handling mixed handle positions like Right -> Bottom for example
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
      const isSameDir =
        sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo =
        sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo =
        sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget =
        (sourceDir[dirAccessor] === 1 &&
          ((!isSameDir && sourceGtTargetOppo) ||
            (isSameDir && sourceLtTargetOppo))) ||
        (sourceDir[dirAccessor] !== 1 &&
          ((!isSameDir && sourceLtTargetOppo) ||
            (isSameDir && sourceGtTargetOppo)));

      if (flipSourceTarget) {
        points = dirAccessor === 'x' ? sourceTarget : targetSource;
      }
    }

    centerX = points[0].x;
    centerY = points[0].y;
    if (Math.abs(sourceGapped.y - targetGapped.y) > offset * 2.5) {
      centerY = Math.min(sourceGapped.y, targetGapped.y) + offset * 2.5;
    } else {
      centerY = points[0].y;
    }
  }

  const pathPoints = [source, sourceGapped, ...points, targetGapped, target];

  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}

function getBend(
  a: XYPosition,
  b: XYPosition,
  c: XYPosition,
  size: number
): string {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;

  // no bend
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  // first segment is horizontal
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${
      y + bendSize * yDir
    }`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

export function getFixStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 10,
  centerX,
  centerY,
  offset = 10,
  sourceXSet = 0,
  sourceYSet = 0,
  targetXSet = 0,
  targetYSet = 0,
  vertices,
}: GetFixStepPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number
] {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset,
    sourceXSet,
    sourceYSet,
    targetXSet,
    targetYSet,
  });

  const path = (vertices ?? points).reduce<string>((res, p, i) => {
    let segment = '';

    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
    }

    res += segment;

    return res;
  }, '');

  return [path, labelX, labelY, offsetX, offsetY];
}

export const FixStepEdge = memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle = { fontWeight: 'bolder' },
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius = 4,
    style,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    markerEnd,
    markerStart,
    pathOptions,
    interactionWidth,
    data,
  }: FixStepEdgeProps) => {
    const [path, labelX, labelY] = getFixStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: pathOptions?.borderRadius,
      offset: pathOptions?.offset,
      sourceXSet: data?.sourceXSet,
      sourceYSet: data?.sourceYSet,
      targetXSet: data?.targetXSet,
      targetYSet: data?.targetYSet,
      vertices: data?.vertices,
    });

    return (
      <BaseEdge
        path={path}
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
        markerStart={markerStart}
        interactionWidth={interactionWidth}
      />
    );
  }
);

FixStepEdge.displayName = 'FixStepEdge';