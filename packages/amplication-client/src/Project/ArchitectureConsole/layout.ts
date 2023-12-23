import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";

import {
  groupContentCoords,
  NodeType,
  Node,
  EntityNode,
  ResourceNode,
} from "./types";

const FIELD_HEIGHT = 30;
const CHAR_WIDTH = 10;
const MARGIN = 300;
const GROUP_PADDING = 40;
const GROUP_TOP_PADDING = 100;
const GROUP_MARGIN = 40;

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "75",
    "elk.layered.spacing.nodeNodeBetweenLayers": "75",
    "org.eclipse.elk.padding": `[top=${GROUP_TOP_PADDING},left=${GROUP_PADDING},bottom=${GROUP_PADDING},right=${GROUP_PADDING}]`,
  },
});

const normalizeSize = (value: number) => Math.max(value, MARGIN);

const calculateEntityNodeHeight = (node: EntityNode) => {
  const fieldsHeight = node.data.payload.fields.length * FIELD_HEIGHT;
  const heightWithTitle = fieldsHeight + FIELD_HEIGHT;

  return normalizeSize(heightWithTitle);
};

const calculateEntityNodeWidth = (node: EntityNode) => {
  const headerLength = node.data.payload.displayName.length;

  const columnsLength = node.data.payload.fields.reduce((acc, curr) => {
    const length =
      curr.displayName.length +
      curr.dataType.length +
      (curr.customAttributes?.length || 0);

    return acc < length ? length : acc;
  }, 0);

  const width =
    (headerLength > columnsLength ? headerLength : columnsLength) * CHAR_WIDTH;

  return normalizeSize(width);
};

export const getAutoLayout = async (nodes: Node[], edges: Edge[]) => {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  const groups = nodes.filter(
    (node) => node.type === "modelGroup"
  ) as ResourceNode[];

  groups.forEach((group) => {
    const children = nodes.filter(
      (node) => node.type === "model" && node.parentNode === group.id
    ) as EntityNode[];

    const childNodes: ElkNode[] = [];

    children.forEach((node) => {
      childNodes.push({
        id: node.id,
        width: calculateEntityNodeWidth(node),
        height: calculateEntityNodeHeight(node),
      });
    });

    elkNodes.push({
      id: group.id,
      children: childNodes,
    });
  });

  edges.forEach((edge) => {
    elkEdges.push({
      id: edge.id,
      targets: [edge.target],
      sources: [edge.source],
    });
  });

  const layout = await elk.layout({
    id: "root",
    children: elkNodes,
    edges: elkEdges,
  });

  return layout;
};

export const getGroupsAutoLayout = async (groups: groupContentCoords[]) => {
  const elkNodes: ElkNode[] = [];

  groups.forEach((group) => {
    elkNodes.push({
      id: group.groupId,
      width: group.maxX - group.minX,
      height: group.maxY - group.minY,
    });
  });

  const layout = await elk.layout({
    id: "root",
    layoutOptions: {
      "org.eclipse.elk.aspectRatio": "2.5",
      "elk.algorithm": "org.eclipse.elk.box",
      "elk.direction": "LEFT",
      "org.eclipse.elk.contentAlignment": "H_RIGHT",
      "org.eclipse.elk.box.packingMode": "GROUP_DEC",
      "org.eclipse.elk.expandNodes": "true",
      "elk.spacing.nodeNode": GROUP_MARGIN.toString(),
    },

    children: elkNodes,
  });

  return layout;
};

export async function applyLayoutToNodes(nodes: Node[], layout: ElkNode) {
  const groups = nodes.filter(
    (node) => node.type === "modelGroup"
  ) as ResourceNode[];

  const groupCords: groupContentCoords[] = [];

  const allEntityNodes = groups.flatMap((group) => {
    const groupElkNode = layout.children.find((n) => n.id === group.id);

    const children = nodes.filter(
      (node) => node.parentNode === group.id
    ) as EntityNode[];

    let minX = 0,
      minY = 0,
      maxX = 0,
      maxY = 0;

    const groupEntityNodes = children.map((node) => {
      const position = groupElkNode.children.find((n) => n.id === node.id);
      minX = Math.min(minX, position.x);
      minY = Math.min(minY, position.y);
      maxX = Math.max(maxX, position.x + position.width);
      maxY = Math.max(maxY, position.y + position.height);
      return {
        ...node,
        position: { x: position.x, y: position.y },
      };
    });

    groupCords.push({
      groupId: group.id,
      minX,
      minY,
      maxX,
      maxY,
    });

    return groupEntityNodes;
  });

  const groupsElkNode = await getGroupsAutoLayout(groupCords);

  const groupNodes: ResourceNode[] = groups.map((node) => {
    const position = groupsElkNode.children.find((n) => n.id === node.id);
    return {
      ...node,
      style: { width: position.width, height: position.height, zIndex: -1 },
      position: { x: position.x, y: position.y },
    };
  });

  return [...groupNodes, ...allEntityNodes];
}

export async function applyAutoLayout(
  nodes: Node[],
  edges: Edge[]
): Promise<Node[]> {
  const layout = await getAutoLayout(nodes, edges);

  return applyLayoutToNodes(nodes, layout);
}
