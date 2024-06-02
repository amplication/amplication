import { memo, useCallback } from "react";
import { Position, getBezierPath, useStore, type EdgeProps } from "reactflow";
import clsx from "clsx";
import { getEdgeParams } from "../helpers";

const RelationEdge = ({
  id,
  source,
  target,
  sourceHandleId,
  targetHandleId,
  style,
  data,
  selected,
}: EdgeProps<any>) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode || !sourceHandleId || !targetHandleId) {
    return null;
  }
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    sourceHandleId,
    targetNode,
    targetHandleId
  );

  const offset = (x: number, position: Position) => {
    const offsetMargin = 6;
    if (position === Position.Right) return x + offsetMargin;
    else return x - offsetMargin;
  };

  const [edgePath] = getBezierPath({
    sourceX: offset(sx, sourcePos),
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: offset(tx, targetPos),
    targetY: ty,
    curvature: 0.5,
  });

  const isSelected = selected || sourceNode?.selected || targetNode.selected;
  const {
    targetFieldAllowsMultipleSelections,
    sourceFieldAllowsMultipleSelections,
  } = data;

  const [markerStart, markerEnd] = [
    `url(#relation-${sourceFieldAllowsMultipleSelections ? "many" : "one"}${
      isSelected ? "-selected" : ""
    })`,
    `url(#relation-${targetFieldAllowsMultipleSelections ? "many" : "one"}${
      isSelected ? "-selected" : ""
    })`,
  ];

  const stroke = isSelected ? "#fff" : "#5c7194";

  return (
    <path
      id={id}
      className={clsx("react-flow__edge-path")}
      d={edgePath}
      markerStart={markerStart}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke,
      }}
    />
  );
};

export default memo(RelationEdge);
