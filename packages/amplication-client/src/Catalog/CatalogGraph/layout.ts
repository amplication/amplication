import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";
import { Node, NODE_TYPE_GROUP, NODE_TYPE_RESOURCE } from "./types";

const TITLE_HEIGHT = 46;
const CHAR_WIDTH = 10;
const MARGIN = 100;
const MIN_WIDTH = 200;
const RELATION_HEIGHT = 36;
const RELATION_TITLE_HEIGHT = 53;

const NODES_LAYOUT_OPTIONS = {
  "elk.algorithm": "org.eclipse.elk.layered",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.componentComponent": "100",
  "org.eclipse.elk.padding": `[top=${MARGIN},left=${MARGIN},bottom=${MARGIN},right=${MARGIN}]`,
};

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "org.eclipse.elk.force",
    "org.eclipse.elk.aspectRatio": "2.5", //this may be calculated based on screen size
    "elk.direction": "LEFT",
    "org.eclipse.elk.contentAlignment": "H_RIGHT",
    "org.eclipse.elk.expandNodes": "true",
    "elk.spacing.nodeNode": "100",
    "elk.padding": "[top=100,left=100,bottom=100,right=100]",
  },
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

  return normalizeSize(heightWithTitle, MARGIN);
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

function buildElkTree(nodes: Node[]): ElkNode[] {
  // Create a map for quick lookup by node id
  const nodeMap: Map<string, ElkNode> = new Map();
  const resourceNodeContainers: Map<string, ElkNode> = new Map();

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

  return tree;
}

export const getAutoLayout = async (nodes: Node[], edges: Edge[]) => {
  const elkEdges: ElkExtendedEdge[] = [];

  edges.forEach((edge) => {
    elkEdges.push({
      id: edge.id,
      targets: [edge.target],
      sources: [edge.source],
    });
  });

  const layout = await elk.layout({
    id: "root",
    children: buildElkTree(nodes),
    edges: elkEdges,
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
  edges: Edge[]
): Promise<Node[]> {
  const layout = await getAutoLayout(nodes, edges);

  return applyLayoutToNodes(nodes, layout);
}
