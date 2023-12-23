import { type Edge, type Node as ReactFlowNode } from "reactflow";
import * as models from "../../models";
import { type } from "os";

export type NodeType = "model" | "modelGroup";

export type NodePayload<T> = {
  payload: T;
  //selected
  //editable
  //originalParentId
};

type NodeWithType<T> = ReactFlowNode<T, NodeType>;

export type EntityNode = NodeWithType<NodePayload<models.Entity>> & {
  type: "model";
};
export type ResourceNode = NodeWithType<NodePayload<models.Resource>> & {
  type: "modelGroup";
};

export type Node = EntityNode | ResourceNode;

export type groupContentCoords = {
  groupId: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
