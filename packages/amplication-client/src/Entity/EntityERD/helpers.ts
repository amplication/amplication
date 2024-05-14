import { type Node } from "reactflow";
import { internalsSymbol, Position } from "reactflow";

import * as models from "../../models";
import { applyLayoutToNodes, getAutoLayout } from "./layout";

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

function entitiesToNodes(entities: models.Entity[]) {
  const nodes = entities.map((entity) => ({
    data: entity,
    id: entity.id,
    type: "model",
    position: {
      x: 0,
      y: 0,
    },
  }));
  return nodes;
}

function entitiesToEdges(entities: models.Entity[]) {
  const relations: {
    sourceEntity: string;
    targetEntity: string;
    sourceField: string;
    targetField: string;
    sourceFieldAllowsMultipleSelections: boolean;
    targetFieldAllowsMultipleSelections?: boolean;
  }[] = [];

  entities?.forEach((entity) => {
    entity?.fields?.forEach((field) => {
      if (field.properties.relatedEntityId) {
        const { relatedEntityId, relatedFieldId, allowMultipleSelection } =
          field.properties;
        const existingRelationIndex = relations.findIndex(
          (relation) =>
            relation.targetEntity === entity.id &&
            relation.targetField === field.permanentId
        );
        if (existingRelationIndex !== -1) {
          relations[existingRelationIndex].targetFieldAllowsMultipleSelections =
            allowMultipleSelection;
        } else {
          relations.push({
            sourceEntity: entity.id,
            sourceField: field.permanentId,
            sourceFieldAllowsMultipleSelections: allowMultipleSelection,
            targetEntity: relatedEntityId,
            targetField: relatedFieldId,
          });
        }
      }
    });
  });

  const edges = relations.map((relation) => ({
    source: relation.sourceEntity,
    target: relation.targetEntity,
    id: `${relation.sourceField}-${relation.targetField}`,
    sourceHandle: relation.sourceField,
    targetHandle: relation.targetField,
    type: "relation",
    data: {
      sourceFieldAllowsMultipleSelections:
        relation.sourceFieldAllowsMultipleSelections,
      targetFieldAllowsMultipleSelections:
        relation.targetFieldAllowsMultipleSelections,
    },
  }));

  return edges;
}

export async function entitiesToNodesAndEdges(entities: models.Entity[]) {
  const nodes = entitiesToNodes(entities);
  const edges = entitiesToEdges(entities);
  const layout = await getAutoLayout(nodes, edges);
  return { nodes: applyLayoutToNodes(nodes, layout), edges };
}
