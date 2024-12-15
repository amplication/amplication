import { internalsSymbol, Position } from "reactflow";
import { BlueprintNode, Node, NODE_TYPE_MODEL, SimpleRelation } from "./types";

import * as models from "../../models";
import { applyAutoLayout } from "./layout";

function getParams(
  nodeA: Node,
  handleA: string,
  nodeB: Node
): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const position = centerA.x > centerB.x ? Position.Left : Position.Right;

  const [x, y] = getHandleCoordsByPosition(nodeA, handleA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(
  node: Node,
  handleId: string,
  handlePosition: Position
): [number, number] {
  // all handles are from type source, that's why we use handleBounds.source here
  const handle = node[internalsSymbol]?.handleBounds?.source?.find(
    (h) => h.position === handlePosition && h.id === handleId
  );

  if (!handle || !node.positionAbsolute) return [0, 0];
  let offsetX = handle.width / 2;
  const offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
  }

  const x = node.positionAbsolute.x + handle.x + offsetX;
  const y = node.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

function getNodeCenter(node: Node) {
  if (!node.positionAbsolute || !node.width || !node.height)
    return { x: 0, y: 0 };

  return {
    x: node.positionAbsolute.x + node.width / 2,
    y: node.positionAbsolute.y + node.height / 2,
  };
}

export function getEdgeParams(
  source: Node,
  sourceHandleId: string,
  target: Node,
  targetHandleId: string
) {
  const [sx, sy, sourcePos] = getParams(source, sourceHandleId, target);
  const [tx, ty, targetPos] = getParams(target, targetHandleId, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}

function blueprintsToNodes(blueprints: models.Blueprint[]): Node[] {
  const nodes: BlueprintNode[] = blueprints.map((blueprint) => ({
    data: {
      payload: blueprint,
    },
    id: blueprint.key,
    draggable: true,
    selectable: true,
    deletable: false,

    type: NODE_TYPE_MODEL,
    position: {
      x: 0,
      y: 0,
    },
  }));
  return nodes;
}

export function nodesToSimpleEdges(nodes: Node[]) {
  const relations: SimpleRelation[] = [];

  nodes.forEach((node) => {
    const blueprint = node.data.payload;

    blueprint.relations?.forEach((relation) => {
      //check if the referenced node exists
      const relatedNode = nodes.find((n) => n.id === relation.relatedTo);
      if (relatedNode) {
        relations.push({
          source: blueprint.key,
          sourceKey: relation.key,
          target: relation.relatedTo,
          targetKey: relation.relatedTo,
          key: relation.key,
        });
      }
    });
  });

  const edges = relations.map((relation) => ({
    source: relation.source,
    target: relation.target,
    id: `${relation.source}-${relation.target}--${relation.key}`,
    sourceHandle: `relation-handle-${relation.sourceKey}`,
    targetHandle: `node-handle-${relation.targetKey}`,
    type: "relationSimple",
  }));

  return edges;
}

export async function blueprintsToNodesAndEdges(
  blueprints: models.Blueprint[]
) {
  const nodes = blueprintsToNodes(blueprints);

  const simpleEdges = nodesToSimpleEdges(nodes);

  return {
    nodes: await applyAutoLayout(nodes, simpleEdges),
    simpleEdges,
  };
}
