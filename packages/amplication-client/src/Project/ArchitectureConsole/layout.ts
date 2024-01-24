import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";

import {
  EntityNode,
  NODE_TYPE_MODEL,
  NODE_TYPE_MODEL_GROUP,
  Node,
  ResourceNode,
  groupContentCoords,
} from "./types";

const FIELD_HEIGHT = 30;
const CHAR_WIDTH = 10;
const MARGIN = 100;
const GROUP_PADDING = 40;
const GROUP_TOP_PADDING = 100;
const GROUP_MARGIN = 60;
const SIMPLE_MODEL_MIN_WIDTH = 200;
const SIMPLE_MODEL_MIN_HEIGHT = 60;
const GROUP_MIN_SIZE = 400;

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "org.eclipse.elk.layered",
    "elk.spacing.nodeNode": "50",
    "elk.layered.spacing.nodeNodeBetweenLayers": "150",
    "org.eclipse.elk.padding": `[top=${GROUP_TOP_PADDING},left=${GROUP_PADDING},bottom=${GROUP_PADDING},right=${GROUP_PADDING}]`,
  },
});

const normalizeSize = (value: number, minValue: number) =>
  Math.max(value, minValue);

const calculateEntityNodeHeight = (
  node: EntityNode,
  showDetailedRelations: boolean
) => {
  const fieldsHeight = showDetailedRelations
    ? node.data.payload.fields.length * FIELD_HEIGHT
    : 0;
  const heightWithTitle = fieldsHeight + FIELD_HEIGHT;

  return normalizeSize(
    heightWithTitle,
    showDetailedRelations ? MARGIN : SIMPLE_MODEL_MIN_HEIGHT
  );
};

const calculateEntityNodeWidth = (
  node: EntityNode,
  showDetailedRelations: boolean
) => {
  const headerLength = node.data.payload.displayName.length;

  const columnsLength = showDetailedRelations
    ? node.data.payload.fields.reduce((acc, curr) => {
        const length =
          curr.displayName.length +
          curr.dataType.length +
          (curr.customAttributes?.length || 0);

        return acc < length ? length : acc;
      }, 0)
    : 0;

  const width =
    (headerLength > columnsLength ? headerLength : columnsLength) * CHAR_WIDTH;

  return normalizeSize(
    width,
    showDetailedRelations ? MARGIN : SIMPLE_MODEL_MIN_WIDTH
  );
};

export const getAutoLayout = async (
  nodes: Node[],
  edges: Edge[],
  showDetailedRelations: boolean
) => {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  const groups = nodes.filter(
    (node) => node.type === NODE_TYPE_MODEL_GROUP
  ) as ResourceNode[];

  groups.forEach((group) => {
    const children = nodes.filter(
      (node) => node.type === NODE_TYPE_MODEL && node.parentNode === group.id
    ) as EntityNode[];

    const childNodes: ElkNode[] = [];

    children.forEach((node) => {
      childNodes.push({
        id: node.id,
        width: calculateEntityNodeWidth(node, showDetailedRelations),
        height: calculateEntityNodeHeight(node, showDetailedRelations),
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

export const getGroupsAutoLayout = async (groups: ResourceNode[]) => {
  const elkNodes: ElkNode[] = [];

  groups.forEach((group) => {
    elkNodes.push({
      id: group.id,
      width: group.data.width,
      height: group.data.height,
    });
  });

  const layout = await elk.layout({
    id: "root",
    layoutOptions: {
      "elk.algorithm": "org.eclipse.elk.rectpacking",
      "org.eclipse.elk.aspectRatio": "2.5", //this may be calculated based on screen size
      "elk.direction": "LEFT",
      "org.eclipse.elk.contentAlignment": "H_RIGHT",
      "org.eclipse.elk.expandNodes": "true",
      "elk.spacing.nodeNode": GROUP_MARGIN.toString(),
    },

    children: elkNodes,
  });

  return layout;
};

export async function applyLayoutToNodes(
  nodes: Node[],
  layout: ElkNode
): Promise<Node[]> {
  const groups = nodes.filter(
    (node) => node.type === NODE_TYPE_MODEL_GROUP
  ) as ResourceNode[];

  const groupCoords: groupContentCoords[] = [];

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
        style: { width: position.width, height: position.height },
        data: {
          ...node.data,
          width: position.width,
          height: position.height,
        },
      };
    });

    group.data.width = normalizeSize(maxX - minX, GROUP_MIN_SIZE);
    group.data.height = normalizeSize(maxY - minY, GROUP_MIN_SIZE);

    return groupEntityNodes;
  });

  const groupsElkNode = await getGroupsAutoLayout(groups);

  const groupNodes: ResourceNode[] = groups.map((node) => {
    const position = groupsElkNode.children.find((n) => n.id === node.id);
    return {
      ...node,
      style: { width: position.width, height: position.height, zIndex: -1 },
      position: { x: position.x, y: position.y },
      data: {
        ...node.data,
        width: position.width,
        height: position.height,
      },
    };
  });

  return [...groupNodes, ...allEntityNodes];
}

export async function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  showDetailedRelations: boolean
): Promise<Node[]> {
  const layout = await getAutoLayout(nodes, edges, showDetailedRelations);

  return applyLayoutToNodes(nodes, layout);
}
