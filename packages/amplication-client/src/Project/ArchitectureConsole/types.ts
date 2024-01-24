import { type Edge, type Node as ReactFlowNode } from "reactflow";
import * as models from "../../models";
import { type } from "os";

export const NODE_TYPE_MODEL = "model";
export const NODE_TYPE_MODEL_GROUP = "modelGroup";

export type NodeType = typeof NODE_TYPE_MODEL | typeof NODE_TYPE_MODEL_GROUP;

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
  type: typeof NODE_TYPE_MODEL;
};

export type ResourceNodePayload = NodePayload<models.Resource> & {
  groupOrder: number;
  groupColor: string;
  isEditable: boolean;
};

export type ResourceNode = NodeWithType<ResourceNodePayload> & {
  type: typeof NODE_TYPE_MODEL_GROUP;
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
export type ModelGroupResource = {
  tempId: string;
  name: string;
  color?: string;
};

export type CopiedEntity = {
  entityId: string;
  originalResourceId: string;
  targetResourceId: string;
};

export type ModelChanges = {
  newServices: ModelGroupResource[];
  movedEntities: CopiedEntity[];
};
