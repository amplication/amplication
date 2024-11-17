import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";
import { Node } from "./types";

const FIELD_HEIGHT = 30;
const CHAR_WIDTH = 10;
const GROUP_PADDING = 40;
const GROUP_TOP_PADDING = 100;
const SIMPLE_MODEL_MIN_WIDTH = 200;
const SIMPLE_MODEL_MIN_HEIGHT = 60;

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

const calculateNodeHeight = (node: Node) => {
  return normalizeSize(FIELD_HEIGHT, SIMPLE_MODEL_MIN_HEIGHT);
};

const calculateNodeWidth = (node: Node) => {
  const headerLength = node.data.payload.name.length;

  const width = headerLength * CHAR_WIDTH;

  return normalizeSize(width, SIMPLE_MODEL_MIN_WIDTH);
};

export const getAutoLayout = async (nodes: Node[], edges: Edge[]) => {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  nodes.forEach((node) => {
    elkNodes.push({
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

  console.log({ elkNodes, elkEdges });

  const layout = await elk.layout({
    id: "root",
    children: elkNodes,
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
    const position = layout.children.find((n) => n.id === node.id);

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

  return allNodes;
}

export async function applyAutoLayout(
  nodes: Node[],
  edges: Edge[]
): Promise<Node[]> {
  const layout = await getAutoLayout(nodes, edges);

  return applyLayoutToNodes(nodes, layout);
}
