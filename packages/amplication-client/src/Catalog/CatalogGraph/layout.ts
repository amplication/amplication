import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";
import { Node, NODE_TYPE_GROUP, NODE_TYPE_RESOURCE, WindowSize } from "./types";

const TITLE_HEIGHT = 46;
const CHAR_WIDTH = 10;
const NODE_MIN_HEIGHT = 100;
const MIN_WIDTH = 200;
const RELATION_HEIGHT = 36;
const RELATION_TITLE_HEIGHT = 53;
const GROUP_PADDING = "100";
const NODES_SPACING = "250";

const NODES_LAYOUT_OPTIONS = {
  "elk.algorithm": "elk.layered",
  "elk.spacing.nodeNode": NODES_SPACING,
  "elk.layered.spacing.nodeNodeBetweenLayers": NODES_SPACING,
  "elk.spacing.componentComponent": "200",
  "elk.padding": `[top=${GROUP_PADDING},left=${GROUP_PADDING},bottom=${GROUP_PADDING},right=${GROUP_PADDING}]`,
};

const GROUPS_LAYOUT_OPTIONS = {
  "elk.algorithm": "elk.rectpacking",
  "elk.direction": "LEFT",
  "elk.contentAlignment": "H_RIGHT",
  "elk.expandNodes": "true",
  "elk.spacing.nodeNode": GROUP_PADDING,
  "elk.padding": `[top=${GROUP_PADDING},left=${GROUP_PADDING},bottom=${GROUP_PADDING},right=${GROUP_PADDING}]`,
};

const elk = new Elk({
  defaultLayoutOptions: GROUPS_LAYOUT_OPTIONS,
});

const normalizeSize = (value: number, minValue: number) =>
  Math.max(value, minValue);

const calculateNodeHeight = (node: Node) => {
  if (node.type === NODE_TYPE_GROUP) {
    //group size is calculated based on the children
    return undefined;
  }

  const relationCount = node.data.relationCount || 0;

  const propertiesHeight =
    relationCount * RELATION_HEIGHT + RELATION_TITLE_HEIGHT;

  const heightWithTitle = propertiesHeight + TITLE_HEIGHT;

  return normalizeSize(heightWithTitle, NODE_MIN_HEIGHT);
};

const calculateNodeWidth = (node: Node) => {
  if (node.type === NODE_TYPE_GROUP) {
    //group size is calculated based on the children
    return undefined;
  }

  const headerLength = node.data.payload.name.length;

  const columnsLength = 0;
  // node.data.payload.properties?.reduce((acc, curr) => {
  //   const length = curr.name.length;

  //   return acc < length ? length : acc;
  // }, 0) || 0;

  const width =
    (headerLength > columnsLength ? headerLength : columnsLength) * CHAR_WIDTH;

  return normalizeSize(width, MIN_WIDTH);
};

function buildElkTree(nodes: Node[]): {
  elkNodes: ElkNode[];
  groupsExist: boolean;
} {
  // Create a map for quick lookup by node id
  const nodeMap: Map<string, ElkNode> = new Map();
  const resourceNodeContainers: Map<string, ElkNode> = new Map();

  const groupsExist = nodes.some((node) => node.type === NODE_TYPE_GROUP);

  // Initialize each node as an ElkNode with an empty children array
  nodes.forEach((node) => {
    const elkNode: ElkNode = {
      id: node.id,
      children: [],
    };

    if (node.type === NODE_TYPE_RESOURCE) {
      elkNode.width = calculateNodeWidth(node);
      elkNode.height = calculateNodeHeight(node);
    } else {
      //
    }

    nodeMap.set(node.id, elkNode);
  });

  // Build the tree structure
  const tree: ElkNode[] = [];

  nodes.forEach((node) => {
    const elkNode = nodeMap.get(node.id);
    if (node.parentId) {
      // Find the parent and add the current node to its children
      const parentElkNode = nodeMap.get(node.parentId);
      if (parentElkNode) {
        parentElkNode.children.push(elkNode);
      } else {
        console.warn(
          `Parent with id ${node.parentId} not found for node ${node.id}`
        );
      }
      if (node.type === NODE_TYPE_RESOURCE) {
        resourceNodeContainers.set(node.parentId, parentElkNode);
      }
    } else {
      // If no parentId, this node is a root node
      tree.push(elkNode);
    }
  });

  resourceNodeContainers.forEach((container, id) => {
    container.layoutOptions = NODES_LAYOUT_OPTIONS;
  });

  return { elkNodes: tree, groupsExist };
}

export const getAutoLayout = async (
  nodes: Node[],
  edges: Edge[],
  windowsSize: WindowSize
) => {
  const elkEdges: ElkExtendedEdge[] = [];

  const aspectRatio = (windowsSize.width / windowsSize.height).toString();

  edges.forEach((edge) => {
    elkEdges.push({
      id: edge.id,
      targets: [edge.target],
      sources: [edge.source],
    });
  });

  const { elkNodes, groupsExist } = buildElkTree(nodes);

  const layout = await elk.layout({
    id: "root",
    children: elkNodes,
    edges: elkEdges,
    layoutOptions: !groupsExist
      ? {
          ...NODES_LAYOUT_OPTIONS,
          "elk.aspectRatio": aspectRatio,
        }
      : {
          ...GROUPS_LAYOUT_OPTIONS,
          "elk.aspectRatio": aspectRatio,
        },
  });

  return layout;
};

export async function applyLayoutToNodes(
  nodes: Node[],
  layout: ElkNode
): Promise<Node[]> {
  // Create a map of node positions from the ELK layout
  const positions: Record<string, ElkNode> = {};

  const traverseElkTree = (elkNode: ElkNode) => {
    positions[elkNode.id] = elkNode;

    if (elkNode.children) {
      elkNode.children.forEach(traverseElkTree);
    }
  };

  // Traverse the ELK layout tree to extract positions
  traverseElkTree(layout);

  // Map over the React Flow nodes to update their positions
  return nodes.map((node) => {
    const position = positions[node.id];
    if (position) {
      return {
        ...node,

        position: {
          x: position.x,
          y: position.y,
        },
        style: {
          ...{ width: position.width, height: position.height },
          ...(node.type === NODE_TYPE_GROUP ? { zIndex: -1 } : {}),
        },
      };
    }
    return node;
  });
}

export async function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  WindowsSize: WindowSize
): Promise<Node[]> {
  const layout = await getAutoLayout(nodes, edges, WindowsSize);

  return applyLayoutToNodes(nodes, layout);
}
