import { type Edge, type Node as ReactFlowNode } from "reactflow";
import * as models from "../../models";
import { type } from "os";

export type NodeType = "model" | "modelGroup" | "modelSimple";

export type NodePayload<T> = {
  payload: T;
  width?: number;
  height?: number;
  originalParentNode?: string;
  isCurrentDropTarget?: boolean;
};

export type NodePayloadWithPayloadType = NodePayload<
  models.Entity | models.Resource
>;

type NodeWithType<T> = ReactFlowNode<T, NodeType>;

export type EntityNode = NodeWithType<NodePayload<models.Entity>> & {
  type: "model" | "modelSimple";
};

export type ResourceNodePayload = NodePayload<models.Resource> & {
  groupOrder: number;
  groupColor: string;
};

export type ResourceNode = NodeWithType<ResourceNodePayload> & {
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

export type SimpleRelation = {
  sourceEntity: string;
  targetEntity: string;
};

export type DetailedRelation = SimpleRelation & {
  sourceField: string;
  targetField: string;
  sourceFieldAllowsMultipleSelections: boolean;
  targetFieldAllowsMultipleSelections?: boolean;
};

export type Relation = SimpleRelation | DetailedRelation;
