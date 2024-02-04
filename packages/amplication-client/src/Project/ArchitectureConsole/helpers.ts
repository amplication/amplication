import {
  Node,
  ResourceNode,
  EntityNode,
  DetailedRelation,
  SimpleRelation,
  NODE_TYPE_MODEL,
  NODE_TYPE_MODEL_GROUP,
} from "./types";
import { internalsSymbol, Position, XYPosition } from "reactflow";

import * as models from "../../models";
import { applyAutoLayout } from "./layout";

const resourceColorMapping: { [key: number]: string } = {
  0: "#31C587",
  1: "#A787FF",
  2: "#F85B6E",
  3: "#20A4F3",
  4: "#f685a1",
  5: "#F6AA50",
  6: "#FF5118",
  7: "#FF5a00",
  8: "#FF2608",
  9: "#FF8500",
  10: "#FF1508",
  11: "#FF5f00",
  12: "#FF3400",
  13: "#FF9600",
  14: "#FF4200",
  15: "#Fb6F07",
  16: "#FF2C00",
  17: "#FF1600",
  18: "#FF4300",
  19: "#FF1b0F",
  20: "#FF5713",
  21: "#FF1100",
  22: "#FF8200",
  23: "#FF7B00",
  24: "#FF5200",
  25: "#FF4B00",
  26: "#FF7200",
};

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

function entitiesToNodes(
  resources: models.Resource[],
  showDetailedRelations: boolean
): Node[] {
  const parents: ResourceNode[] = resources.map((resource, index) => ({
    data: {
      payload: resource,
      groupOrder: index,
      groupColor: resourceColorMapping[index],
      isEditable: false,
    },
    selectable: false,
    deletable: false,
    draggable: false,
    id: resource.id,
    type: NODE_TYPE_MODEL_GROUP,
    dragHandle: ".group-drag-handle",
    position: {
      x: 0,
      y: 0,
    },
  }));

  const nodes: EntityNode[] = resources.flatMap((resource) =>
    resource.entities.map((entity) => ({
      data: { payload: entity, originalParentNode: entity.resourceId },
      id: entity.id,
      draggable: false,
      selectable: false,
      deletable: false,

      type: NODE_TYPE_MODEL,
      position: {
        x: 0,
        y: 0,
      },
      parentNode: resource.id,
    }))
  );
  return [...parents, ...nodes];
}

export function tempResourceToNode(
  resource: models.Resource,
  index: number
): ResourceNode {
  const parent: ResourceNode = {
    data: {
      payload: resource,
      groupOrder: index,
      groupColor: resourceColorMapping[index],
      isEditable: false,
    },
    id: resource.id,
    selectable: false,
    deletable: false,
    draggable: false,
    type: NODE_TYPE_MODEL_GROUP,
    dragHandle: ".group-drag-handle",
    position: {
      x: 0,
      y: 0,
    },
  };

  return parent;
}

export function nodesToDetailedEdges(nodes: Node[]) {
  const relations: DetailedRelation[] = [];

  nodes.forEach((node) => {
    if (node.type !== NODE_TYPE_MODEL_GROUP) return;

    const resource = node.data.payload as models.Resource;
    const currentEntityMapping = resource.entities?.reduce(
      (entitiesObj, entity) => {
        entitiesObj[entity.id] = entity;
        return entitiesObj;
      },
      {}
    );
    resource.entities?.forEach((entity) => {
      entity?.fields?.forEach((field) => {
        if (
          field.properties.relatedEntityId &&
          currentEntityMapping[field.properties.relatedEntityId]
        ) {
          const { relatedEntityId, relatedFieldId, allowMultipleSelection } =
            field.properties;

          const existingRelationIndex = relations.findIndex(
            (relation) =>
              relation.targetEntity === entity.id &&
              relation.targetField === field.permanentId
          );
          if (existingRelationIndex !== -1) {
            relations[
              existingRelationIndex
            ].targetFieldAllowsMultipleSelections = allowMultipleSelection;
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

export function nodesToSimpleEdges(nodes: Node[]) {
  const relations: SimpleRelation[] = [];

  nodes.forEach((node) => {
    if (node.type !== NODE_TYPE_MODEL_GROUP) return;

    const resource = node.data.payload as models.Resource;
    const currentEntityMapping = resource.entities?.reduce(
      (entitiesObj, entity) => {
        entitiesObj[entity.id] = entity;
        return entitiesObj;
      },
      {}
    );
    resource.entities?.forEach((entity) => {
      entity?.fields?.forEach((field) => {
        if (
          field.properties.relatedEntityId &&
          currentEntityMapping[field.properties.relatedEntityId]
        ) {
          const { relatedEntityId } = field.properties;
          const existingRelationIndex = relations.findIndex(
            (relation) =>
              (relation.targetEntity === entity.id &&
                relation.sourceEntity === relatedEntityId) ||
              (relation.sourceEntity === entity.id &&
                relation.targetEntity === relatedEntityId)
          );
          if (existingRelationIndex === -1) {
            relations.push({
              sourceEntity: entity.id,
              targetEntity: relatedEntityId,
            });
          }
        }
      });
    });
  });

  const edges = relations.map((relation) => ({
    source: relation.sourceEntity,
    target: relation.targetEntity,
    id: `${relation.sourceEntity}-${relation.targetEntity}`,
    sourceHandle: relation.sourceEntity,
    targetHandle: relation.targetEntity,
    type: "relationSimple",
  }));

  return edges;
}

export async function entitiesToNodesAndEdges(
  resources: models.Resource[],
  showDetailedRelations: boolean
) {
  const nodes = entitiesToNodes(resources, showDetailedRelations);
  const detailedEdges = nodesToDetailedEdges(nodes);

  const simpleEdges = nodesToSimpleEdges(nodes);

  return {
    nodes: await applyAutoLayout(
      nodes,
      showDetailedRelations ? detailedEdges : simpleEdges,
      showDetailedRelations
    ),
    detailedEdges,
    simpleEdges,
  };
}

export function getGroupNodes(nodes: Node[]): ResourceNode[] {
  return nodes.filter(
    (node) => node.type === NODE_TYPE_MODEL_GROUP
  ) as ResourceNode[];
}

export function findGroupByPosition(
  nodes: Node[],
  position: XYPosition
): ResourceNode {
  return nodes.find(
    (node) =>
      node.type === NODE_TYPE_MODEL_GROUP &&
      node.position.x < position.x &&
      node.position.x + node.data.width > position.x &&
      node.position.y < position.y &&
      node.position.y + node.data.height > position.y
  ) as ResourceNode;
}
