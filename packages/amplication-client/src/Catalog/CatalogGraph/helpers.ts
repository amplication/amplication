import { internalsSymbol, Position } from "reactflow";
import {
  ResourceNode,
  Node,
  NODE_TYPE_RESOURCE,
  SimpleRelation,
  GroupNode,
  NODE_TYPE_GROUP,
  GroupByField,
  GroupedResult,
  WindowSize,
} from "./types";

import * as models from "../../models";
import { applyAutoLayout } from "./layout";

const ROOT_NODE_ID = "root-node-id";

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

function resourcesToNodes(
  resources: models.Resource[],
  parentId: string,
  blueprintsMapById: Record<string, models.Blueprint>
): ResourceNode[] {
  return resources.map((resource) => ({
    data: {
      payload: resource,
      relationCount:
        (resource.blueprintId &&
          blueprintsMapById[resource.blueprintId]?.relations?.length) ||
        0,
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
  }));
}

function groupToNode(group: GroupedResult, parentId: string): GroupNode {
  return {
    data: {
      payload: {
        id: group.nodeId,
        name: group.name,
        fieldId: group.fieldId,
        fieldKey: group.fieldKey,
      },
    },
    id: group.nodeId,
    draggable: false,
    selectable: false,
    deletable: false,
    parentId: parentId,
    type: NODE_TYPE_GROUP,
    extent: "parent",
    position: {
      x: 0,
      y: 0,
    },
  };
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

export async function resourcesToNodesAndEdges(
  resources: models.Resource[],
  groupByFields: GroupByField[],
  blueprintsMapById: Record<string, models.Blueprint>,
  WindowsSize: WindowSize
) {
  let nodes: Node[] = [];

  if (groupByFields.length === 0) {
    nodes = resourcesToNodes(resources, undefined, blueprintsMapById);
  } else {
    const root = groupResourcesByPaths(resources, groupByFields);

    nodes = root.children.flatMap((child) =>
      createNodesForGroupsAndResources(child, undefined, blueprintsMapById)
    );
  }

  const simpleEdges = nodesToSimpleEdges(nodes);

  return {
    nodes: await applyAutoLayout(nodes, simpleEdges, WindowsSize),
    simpleEdges,
  };
}

function createNodesForGroupsAndResources(
  group: GroupedResult,
  parentId: string,
  blueprintsMapById: Record<string, models.Blueprint>
): Node[] {
  const firstChildren = group.children?.length && group.children[0];

  const groupNode = groupToNode(group, parentId);

  //check the type of the first children and generate the nodes accordingly
  if ((firstChildren as GroupedResult)?.type === "node-group") {
    const children = group.children.flatMap((child) =>
      createNodesForGroupsAndResources(child, group.nodeId, blueprintsMapById)
    );
    return [groupNode, ...children];
  } else {
    const resources = (group.children as models.Resource[]) || [];
    const nodes = resourcesToNodes(resources, group.nodeId, blueprintsMapById);
    return [groupNode, ...nodes];
  }
}

function groupResourcesByPaths(
  resources: models.Resource[],
  groupByFields: GroupByField[]
): GroupedResult {
  // Helper function to get the value from a resource using a dynamic path
  function getValueByPath(resource: models.Resource, path: string): string {
    return path.split(".").reduce((acc, key) => {
      const value = acc && acc[key] !== undefined ? acc[key] : "Unknown";

      return Array.isArray(value) ? value[0] : value;
    }, resource);
  }

  // Recursive function to group resources
  function groupRecursively(
    items: models.Resource[],
    groupByFields: GroupByField[],
    depth = 0,
    parentKey: string
  ): GroupedResult[] | models.Resource[] {
    if (depth >= groupByFields.length) {
      return items;
    }

    const grouped: Record<
      string,
      {
        fieldId: string;
        fieldKey: string;
        name: string;
        items: models.Resource[];
      }
    > = {};
    const currentGroup = groupByFields[depth];

    const fieldKey = currentGroup.fieldKey;

    items.forEach((item) => {
      const fieldId = getValueByPath(item, currentGroup.idPath);
      const groupName = getValueByPath(item, currentGroup.namePath);

      const groupKey = `${fieldId}-${parentKey}`; //unique ID across the tree

      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          fieldId: fieldId,
          fieldKey: fieldKey,
          name: groupName,
          items: [],
        };
      }

      grouped[groupKey].items.push(item);
    });

    return Object.entries(grouped).map(([key, group]) => {
      const groupWithChildren: GroupedResult = {
        nodeId: key,
        type: "node-group",
        name: group.name,
        fieldId: group.fieldId,
        fieldKey: group.fieldKey,
        children: groupRecursively(
          group.items,
          groupByFields,
          depth + 1,
          `${parentKey}-${key}`
        ),
      };
      return groupWithChildren;
    });
  }

  return {
    nodeId: ROOT_NODE_ID,
    type: "node-group",
    name: "Root",
    children: groupRecursively(resources, groupByFields, 0, "root"),
    fieldKey: "",
    fieldId: "",
  };
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
