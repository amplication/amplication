import { internalsSymbol, Position } from "reactflow";
import {
  ResourceNode,
  Node,
  NODE_TYPE_RESOURCE,
  SimpleRelation,
  GroupNode,
  NODE_TYPE_GROUP,
} from "./types";

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

function resourcesToNodes(resources: models.Resource[]): Node[] {
  const [nodes, groupNodes] = resources.reduce(
    ([nodes, groupNodes], resource) => {
      const group = resource.properties?.DOMAIN;

      //check if gruop is an array and take the first value
      const parentId = Array.isArray(group) ? group[0] : group ?? "NONE";

      const node: ResourceNode = {
        data: {
          payload: resource,
        },
        id: resource.id,
        draggable: true,
        selectable: true,
        deletable: false,
        parentId: parentId,
        type: NODE_TYPE_RESOURCE,
        position: {
          x: 0,
          y: 0,
        },
      };

      nodes.push(node);

      if (!groupNodes[node.parentId]) {
        const groupNode: GroupNode = {
          data: {
            payload: {
              id: node.parentId,
              name: node.parentId,
              color: "#FFFFFF",
            },
          },
          id: node.parentId,
          type: NODE_TYPE_GROUP,
          position: {
            x: 0,
            y: 0,
          },
        };
        groupNodes[node.parentId] = groupNode;
        nodes.push(groupNode);
      }

      return [nodes, groupNodes];
    },
    [[], {}]
  );

  // const nodes: ResourceNode[] = resources.map((resource) => ({
  //   data: {
  //     payload: resource,
  //   },
  //   id: resource.id,
  //   draggable: true,
  //   selectable: true,
  //   deletable: false,
  //   parentId: resource.properties["DOMAIN"] ?? "NONE",

  //   type: NODE_TYPE_RESOURCE,
  //   position: {
  //     x: 0,
  //     y: 0,
  //   },
  // }));
  return [...nodes, ...Object.values(groupNodes)];
}

export function nodesToSimpleEdges(nodes: Node[]) {
  const relations: SimpleRelation[] = [];

  nodes.forEach((node) => {
    if (node.type !== NODE_TYPE_RESOURCE) {
      return;
    }
    const resource = node.data.payload;

    resource.relations?.forEach((relation) => {
      //check if the referenced node exists

      const relatedResources = relation.relatedResources;

      relatedResources.forEach((relatedResource) => {
        const relatedNode = nodes.find((n) => n.id === relatedResource);
        if (relatedNode) {
          relations.push({
            sourceId: resource.id,
            relationKey: relation.relationKey,
            targetId: relatedResource,
            id: `${resource.id}-${relation.relationKey}-${relatedResource}`,
          });
        }
      });
    });
  });

  const edges = relations.map((relation) => ({
    source: relation.sourceId,
    target: relation.targetId,
    id: relation.id,
    sourceHandle: `relation-handle-${relation.sourceId}-${relation.relationKey}`,
    targetHandle: `node-handle-${relation.targetId}`,
    type: "relationSimple",
  }));

  console.log("edges", edges);

  return edges;
}

export async function blueprintsToNodesAndEdges(resources: models.Resource[]) {
  const nodes = resourcesToNodes(resources);

  const simpleEdges = nodesToSimpleEdges(nodes);

  return {
    nodes: await applyAutoLayout(nodes, simpleEdges),
    simpleEdges,
  };
}
