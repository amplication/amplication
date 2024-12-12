import { type Node as ReactFlowNode } from "reactflow";
import * as models from "../../models";

export const NODE_TYPE_MODEL = "blueprint";

export type NodeType = typeof NODE_TYPE_MODEL;

export type NodePayload<T> = {
  payload: T;
  width?: number;
  height?: number;
  highlight?: boolean;
  selectRelatedNodes?: boolean;
};

export type NodePayloadWithPayloadType = NodePayload<models.Blueprint>;

type NodeWithType<T> = ReactFlowNode<T, NodeType>;

export type BlueprintNode = NodeWithType<NodePayload<models.Blueprint>> & {
  type: typeof NODE_TYPE_MODEL;
};

export type Node = BlueprintNode;

export type groupContentCoords = {
  groupId: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type SimpleRelation = {
  source: string;
  sourceKey: string;
  target: string;
  targetKey: string;
  key: string;
};

export type Relation = SimpleRelation;

export type ModelOrganizerPersistentData = {
  projectId: string;
  nodes: Node[];
};

export type GroupPath = {
  idPath: string; // Path for ID used in grouping
  namePath: string; // Path for the display name
};

export type GroupedResult = {
  key: string;
  name: string;
  type: "node-group";
  children?: GroupedResult[] | models.Resource[];
};
