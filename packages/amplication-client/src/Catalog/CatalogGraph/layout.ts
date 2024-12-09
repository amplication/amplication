import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";
import { Node, NODE_TYPE_GROUP, NODE_TYPE_RESOURCE } from "./types";

const TITLE_HEIGHT = 60;
const CHAR_WIDTH = 10;
const MARGIN = 100;
const MIN_WIDTH = 200;

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "org.eclipse.elk.force",
    "elk.direction": "DOWN", // Controls the direction of connected nodes
    "elk.spacing.nodeNode": "100", // Spacing between connected nodes
    //"elk.layered.spacing.nodeNodeBetweenLayers": "50", // Spacing between connected nodes in different layers
    "elk.spacing.componentComponent": "250", // Spacing between disconnected components
    "org.eclipse.elk.aspectRatio": "3", //this may be calculated based on screen size
    //"org.eclipse.elk.force.model": "EADES",
    padding: "250",
  },
});

const normalizeSize = (value: number, minValue: number) =>
  Math.max(value, minValue);

const calculateNodeHeight = (node: Node) => {
  const propertiesHeight = 0;
  // (node.data.payload.properties?.length || 0) * PROPERTY_HEIGHT +
  // PROPERTY_PADDING;

  const heightWithTitle = propertiesHeight + TITLE_HEIGHT;

  return normalizeSize(heightWithTitle, MARGIN);
};

const calculateNodeWidth = (node: Node) => {
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

export const getAutoLayout = async (nodes: Node[], edges: Edge[]) => {
  //const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  const groupNodes = nodes.filter((node) => node.type === NODE_TYPE_GROUP);

  const groupElkNodes = {};

  groupNodes.forEach((node) => {
    groupElkNodes[node.id] = {
      id: node.id,
      children: [],
    };
  });

  groupElkNodes["NONE"] = {
    id: "NONE",
    children: [],
    layoutOptions: {
      "nodeSize.constraints": "MINIMUM_SIZE",
    },
  };

  nodes
    .filter((x) => x.type === NODE_TYPE_RESOURCE)
    .forEach((node) => {
      groupElkNodes[node.parentId].children.push({
        id: node.id,
        width: calculateNodeWidth(node),
        height: calculateNodeHeight(node),
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
    children: Object.values(groupElkNodes),
    edges: elkEdges,
  });

  return layout;
};

export async function applyLayoutToNodes(
  nodes: Node[],
  layout: ElkNode
): Promise<Node[]> {
  const children = nodes;

  const allNodes = children.map((node) => {
    let position;
    if (node.type === NODE_TYPE_GROUP) {
      position = layout.children.find((n) => n.id === node.id);
    } else {
      const group = children.find((n) => n.id === node.parentId);
      position = layout.children
        .find((n) => n.id === group.id)
        .children.find((n) => n.id === node.id);
    }
    //const position = layout.children.find((n) => n.id === node.id);

    return {
      ...node,
      position: { x: position.x, y: position.y },
      style: { width: position.width, height: position.height },
      // data: {
      //   ...node.data,
      //   width: position.width,
      //   height: position.height,
      // },
    };
  });

  return allNodes;
}

export async function applyAutoLayout(
  nodes: Node[],
  edges: Edge[]
): Promise<Node[]> {
  const layout = await getAutoLayout(nodes, edges);

  return applyLayoutToNodes(nodes, layout);
}
