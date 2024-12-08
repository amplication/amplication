import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge } from "reactflow";
import { Node } from "./types";

const FIELD_HEIGHT = 41;
const TITLE_HEIGHT = 50;
const CHAR_WIDTH = 10;
const MARGIN = 100;
const MIN_WIDTH = 200;

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "org.eclipse.elk.layered",
    "elk.spacing.nodeNode": "400",
    "elk.layered.spacing.nodeNodeBetweenLayers": "400",
  },
});

const normalizeSize = (value: number, minValue: number) =>
  Math.max(value, minValue);

const calculateNodeHeight = (node: Node) => {
  const relationsHeight =
    (node.data.payload.relations?.length || 0) * FIELD_HEIGHT;

  const heightWithTitle = relationsHeight + TITLE_HEIGHT;

  return normalizeSize(heightWithTitle, MARGIN);
};

const calculateNodeWidth = (node: Node) => {
  const headerLength = node.data.payload.name.length;

  const columnsLength =
    node.data.payload.relations?.reduce((acc, curr) => {
      const length = curr.name.length;

      return acc < length ? length : acc;
    }, 0) || 0;

  const width =
    (headerLength > columnsLength ? headerLength : columnsLength) * CHAR_WIDTH;

  return normalizeSize(width, MIN_WIDTH);
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
