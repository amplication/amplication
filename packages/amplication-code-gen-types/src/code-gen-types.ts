import * as models from "./models";
import { Lookup, MultiSelectOptionSet, OptionSet } from "./types";
import { namedTypes } from "ast-types";

export {
  EnumEntityPermissionType,
  EnumEntityAction,
  EnumDataType,
} from "./models";

export type WorkerResult = {
  done: boolean;
  message?: string;
  modules?: Module[];
  error?: any;
};

export type WorkerParam = {
  entities: Entity[];
  roles: Role[];
  appInfo: AppInfo;
};

export type ServiceSettings = Omit<
  models.ServiceSettings,
  | "__typename"
  | "id"
  | "createdAt"
  | "updatedAt"
  | "parentBlock"
  | "displayName"
  | "description"
  | "blockType"
  | "versionNumber"
  | "inputParameters"
  | "outputParameters"
  | "lockedByUserId"
  | "lockedAt"
>;

export type AppInfo = {
  name: string;
  description: string;
  version: string;
  id: string;
  url: string;
  settings: ServiceSettings;
};

export type Role = Omit<
  models.ResourceRole,
  "__typename" | "id" | "createdAt" | "updatedAt"
>;

export type EntityPermissionRole = Omit<
  models.EntityPermissionRole,
  | "__typename"
  | "id"
  | "entityVersionId"
  | "action"
  | "entityPermission"
  | "resourceRoleId"
  | "resourceRole"
> & {
  resourceRole: Role;
};

export type EntityPermissionField = Omit<
  models.EntityPermissionField,
  | "__typename"
  | "id"
  | "permissionId"
  | "permission"
  | "fieldPermanentId"
  | "field"
  | "entityVersionId"
  | "permissionRoles"
> & {
  field: EntityField;
  permissionRoles: EntityPermissionRole[] | null;
};

export type EntityPermission = Omit<
  models.EntityPermission,
  | "__typename"
  | "id"
  | "entityVersionId"
  | "entityVersion"
  | "permissionRoles"
  | "permissionFields"
> & {
  permissionRoles: EntityPermissionRole[];
  permissionFields: EntityPermissionField[];
};

export type EntityField = Omit<
  models.EntityField,
  "__typename" | "createdAt" | "updatedAt" | "position" | "dataType"
> & {
  dataType: models.EnumDataType;
};

export type LookupResolvedProperties = Lookup & {
  relatedEntity: Entity;
  relatedField: EntityField;
  isOneToOneWithoutForeignKey?: boolean; //in one-to-one only one side should have a foreign key
};

export type EntityLookupField = Omit<EntityField, "properties"> & {
  properties: LookupResolvedProperties;
};

export type EntityOptionSetField = Omit<EntityField, "properties"> & {
  properties: OptionSet;
};

export type EntityMultiSelectOptionSetField = Omit<
  EntityField,
  "properties"
> & {
  properties: MultiSelectOptionSet;
};

export type Entity = Omit<
  models.Entity,
  | "__typename"
  | "createdAt"
  | "updatedAt"
  | "resource"
  | "resourceId"
  | "entityVersions"
  | "fields"
  | "permissions"
  | "lockedByUserId"
  | "lockedByUser"
  | "lockedAt"
> & {
  fields: EntityField[];
  permissions: EntityPermission[];
  pluralName: string;
};

export type Module = {
  path: string;
  code: string;
};

export type ClassDeclaration = namedTypes.ClassDeclaration & {
  decorators: namedTypes.Decorator[];
};

export type NamedClassDeclaration = ClassDeclaration & {
  id: namedTypes.Identifier;
};

export type NamedClassProperty = namedTypes.ClassProperty & {
  key: namedTypes.Identifier;
  typeAnnotation: namedTypes.TSTypeAnnotation;
  optional?: boolean;
};

export type EntityDTOs = {
  entity: NamedClassDeclaration;
  createInput: NamedClassDeclaration;
  updateInput: NamedClassDeclaration;
  whereInput: NamedClassDeclaration;
  whereUniqueInput: NamedClassDeclaration;
  deleteArgs: NamedClassDeclaration;
  findManyArgs: NamedClassDeclaration;
  findOneArgs: NamedClassDeclaration;
  createArgs?: NamedClassDeclaration;
  updateArgs?: NamedClassDeclaration;
  orderByInput: NamedClassDeclaration;
  listRelationFilter: NamedClassDeclaration;
};

export type EntityEnumDTOs = {
  [dto: string]: namedTypes.TSEnumDeclaration;
};

export type DTOs = {
  [entity: string]: EntityEnumDTOs & EntityDTOs;
};

export type ResourceGenerationConfig = {
  dataServiceGeneratorVersion: string;
  appInfo: AppInfo;
};
