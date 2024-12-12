import { type Node as ReactFlowNode } from "reactflow";
import * as models from "../../models";

export const NODE_TYPE_RESOURCE = "resource";
export const NODE_TYPE_GROUP = "group2"; // "group" is a reserved word

export type NodeType = typeof NODE_TYPE_RESOURCE | typeof NODE_TYPE_GROUP;

export type NodePayload<T> = {
  payload: T;
  width?: number;
  height?: number;
  highlight?: boolean;
  selectRelatedNodes?: boolean;
  color?: string;
  relationCount?: number;
};

export type NodePayloadWithPayloadType =
  | NodePayload<models.Resource>
  | NodePayload<Group>;

type NodeWithType<T> = ReactFlowNode<T, NodeType>;

export type ResourceNode = NodeWithType<NodePayload<models.Resource>> & {
  type: typeof NODE_TYPE_RESOURCE;
};

export type Group = {
  id: string;
  name: string;
  fieldKey: string;
  fieldId: string;
};

export type GroupNodePayload = NodePayload<Group>;

export type GroupNode = NodeWithType<GroupNodePayload> & {
  type: typeof NODE_TYPE_GROUP;
};

export type Node = ResourceNode | GroupNode;

export type groupContentCoords = {
  groupId: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type SimpleRelation = {
  sourceId: string;
  relationKey: string;
  targetId: string;
  id: string;
};

export type Relation = SimpleRelation;

export type GroupByField = {
  fieldKey: string;
  idPath: string; // Path for ID used in grouping
  namePath: string; // Path for the display name
};

export type GroupedResult = {
  nodeId: string;
  name: string;
  fieldKey: string;
  fieldId: string;
  type: "node-group";
  children?: GroupedResult[] | models.Resource[];
};
