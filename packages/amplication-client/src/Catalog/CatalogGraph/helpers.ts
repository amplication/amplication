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

      //check if group is an array and take the first value
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
        extent: "parent",
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
            },
          },
          id: node.parentId,
          type: NODE_TYPE_GROUP,
          selectable: true,
          // deletable: false,
          // draggable: false,
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

  return [...Object.values(groupNodes), ...nodes];
}

export function nodesToSimpleEdges(nodes: Node[]) {
  const relations: SimpleRelation[] = [];

  const nodesMap = nodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  nodes.forEach((node) => {
    if (node.type !== NODE_TYPE_RESOURCE) {
      return;
    }
    const resource = node.data.payload;

    resource.relations?.forEach((relation) => {
      //check if the referenced node exists

      const relatedResources = relation.relatedResources;

      relatedResources.forEach((relatedResource) => {
        const relatedNode = nodesMap[relatedResource];

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

  return edges;
}

export async function resourcesToNodesAndEdges(resources: models.Resource[]) {
  const nodes = resourcesToNodes(resources);

  const simpleEdges = nodesToSimpleEdges(nodes);

  return {
    nodes: await applyAutoLayout(nodes, simpleEdges),
    simpleEdges,
  };
}

export function groupResourcesByPaths(
  resources: models.Resource[],
  groupPaths: string[]
) {
  // Helper function to get the value from a resource using a dynamic path
  function getValueByPath(resource, path) {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : "Unknown";
    }, resource);
  }

  // Recursive function to group resources
  function groupRecursively(items, paths, depth = 0) {
    if (depth >= paths.length) {
      return items;
    }

    const grouped = {};
    const currentPath = paths[depth];

    items.forEach((item) => {
      const groupKey = getValueByPath(item, currentPath);

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }

      grouped[groupKey].push(item);
    });

    // Recurse for subgroups
    for (const key in grouped) {
      grouped[key] = groupRecursively(grouped[key], paths, depth + 1);
    }

    return grouped;
  }

  return groupRecursively(resources, groupPaths);
}

//remove relations that are no longer defined in the blueprint
export function removeUnusedRelations(
  resources: models.Resource[],
  blueprintsMapById: Record<string, models.Blueprint>
): models.Resource[] {
  const relationsMap = Object.values(blueprintsMapById).reduce(
    (acc, blueprint) => {
      blueprint.relations?.forEach((relation) => {
        acc[blueprint.id] = acc[blueprint.id] || {};
        acc[blueprint.id][relation.key] = relation;
      });
      return acc;
    },
    {}
  );

  return resources.map((resource) => {
    const blueprint = blueprintsMapById[resource.blueprintId];
    const relations = resource.relations?.filter((relation) => {
      return relationsMap[blueprint.id]?.[relation.relationKey];
    });

    return {
      ...resource,
      relations,
    };
  });
}
