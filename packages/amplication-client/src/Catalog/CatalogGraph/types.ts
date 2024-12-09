import { type Node as ReactFlowNode } from "reactflow";
import * as models from "../../models";

export const NODE_TYPE_RESOURCE = "resource";
export const NODE_TYPE_GROUP = "group";

export type NodeType = typeof NODE_TYPE_RESOURCE | typeof NODE_TYPE_GROUP;

export type NodePayload<T> = {
  payload: T;
  width?: number;
  height?: number;
  highlight?: boolean;
  selectRelatedNodes?: boolean;
  color?: string;
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
  color: string;
};

export type GroupNode = NodeWithType<NodePayload<Group>> & {
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
