import { ASTNode, namedTypes } from "ast-types";
import * as models from "./models";
import { Lookup, MultiSelectOptionSet, OptionSet } from "./types";
import * as PrismaSchemaDSL from "prisma-schema-dsl";
import { ExpressionKind } from "ast-types/gen/kinds";

export {
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType,
} from "./models";

export type WorkerResult = {
  done: boolean;
  message?: string;
  modules?: Module[];
  error?: any;
};

export type ServiceSettings = Omit<
  BlockOmittedFields<models.ServiceSettings>,
  "id"
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

export type PluginInstallation = BlockOmittedFields<models.PluginInstallation>;

type BlockOmittedFields<T> = Omit<
  T,
  | "__typename"
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

export type clientDirectories = {
  baseDirectory: string;
  srcDirectory: string;
  authDirectory: string;
  publicDirectory: string;
  apiDirectory: string;
};

export type serverDirectories = {
  baseDirectory: string;
  srcDirectory: string;
  authDirectory: string;
  scriptsDirectory: string;
  messageBrokerDirectory: string;
};

export type Topic = BlockOmittedFields<models.Topic>;

export type ServiceTopics = Omit<
  BlockOmittedFields<models.ServiceTopics>,
  "patterns"
> & {
  patterns: Array<models.MessagePattern & { topicName?: string }>;
};

export declare type PrismaClientGenerator = {
  name: string;
  provider: string;
};

export type DataSourceProvider = keyof typeof PrismaSchemaDSL.DataSourceProvider;

export type PrismaDataSource = {
  name: string;
  provider: DataSourceProvider;
  urlEnv: string;
};

export interface ResolverMapping {
  RESOLVER: ASTNode | undefined;
  RESOLVER_BASE: ASTNode | undefined;
  SERVICE: ASTNode | undefined;
  ENTITY: ASTNode | undefined;
  ENTITY_NAME: ASTNode | undefined;
  ENTITY_QUERY: ASTNode | undefined;
  ENTITIES_QUERY: ASTNode | undefined;
  META_QUERY: ASTNode | undefined;
  CREATE_MUTATION: ASTNode | undefined;
  UPDATE_MUTATION: ASTNode | undefined;
  DELETE_MUTATION: ASTNode | undefined;
  CREATE_ARGS: ASTNode | undefined;
  UPDATE_ARGS: ASTNode | undefined;
  DELETE_ARGS: ASTNode | undefined;
  FIND_MANY_ARGS: ASTNode | undefined;
  FIND_ONE_ARGS: ASTNode | undefined;
  CREATE_DATA_MAPPING: ASTNode | undefined;
  UPDATE_DATA_MAPPING: ASTNode | undefined;
}
