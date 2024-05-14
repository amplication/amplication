import { memo, useCallback } from "react";
import { Position, getBezierPath, useStore, type EdgeProps } from "reactflow";
import clsx from "clsx";
import { getEdgeParams } from "../helpers";
import { Node } from "../types";

const SimpleRelationEdge = ({
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
    useCallback((store) => store.nodeInternals.get(source) as Node, [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target) as Node, [target])
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
    const offsetMargin = -3; //no edge image so we need to move the edge a bit closer to the node
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

  const isPendingChange =
    (sourceNode.data.originalParentNode &&
      sourceNode.data.originalParentNode !== sourceNode.parentNode) ||
    (targetNode.data.originalParentNode &&
      targetNode.data.originalParentNode !== targetNode.parentNode);

  const isSelected = selected || sourceNode?.selected || targetNode.selected;
  const stroke = isPendingChange ? "#53dbee" : isSelected ? "#fff" : "#5c7194";
  const strokeDasharray = isPendingChange ? "10 10" : undefined;

  return (
    <path
      id={id}
      className={clsx("react-flow__edge-path")}
      d={edgePath}
      style={{
        ...style,
        stroke,
        strokeDasharray,
      }}
    />
  );
};

export default memo(SimpleRelationEdge);
