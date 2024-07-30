import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge, type Node } from "reactflow";

import * as models from "../../models";

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "75",
    "elk.layered.spacing.nodeNodeBetweenLayers": "75",
  },
});

const FIELD_HEIGHT = 30;
const CHAR_WIDTH = 10;
const MARGIN = 300;

const normalizeSize = (value: number) => Math.max(value, MARGIN);

const calculateHeight = (node: Node<models.Entity>) => {
  const fieldsHeight = node.data.fields.length * FIELD_HEIGHT;
  const heightWithTitle = fieldsHeight + FIELD_HEIGHT;

  return normalizeSize(heightWithTitle);
};

const calculateWidth = (node: Node<models.Entity>) => {
  const headerLength = node.data.displayName.length;

  const columnsLength = node.data.fields.reduce((acc, curr) => {
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

export const getAutoLayout = async (
  nodes: Node<models.Entity>[],
  edges: Edge[]
) => {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  nodes.forEach((node) => {
    elkNodes.push({
      id: node.id,
      width: calculateWidth(node),
      height: calculateHeight(node),
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

export const applyLayoutToNodes = (nodes: Node<any>[], layout: ElkNode) => {
  return nodes.map((node) => {
    const position = layout.children.find((n) => n.id === node.id);
    return { ...node, position: { x: position.x, y: position.y } };
  });
};
