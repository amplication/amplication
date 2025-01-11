import type { namedTypes } from "ast-types";
import * as models from "./models";
import { Lookup, MultiSelectOptionSet, OptionSet } from "./types";
import { DSGResourceData } from "./dsg-resource-data";
import { BuildLogger } from "./build-logger";
import { FileMap, IFile } from "./files";
import { JsonValue } from "type-fest";

export {
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType,
  EnumMessagePatternConnectionOptions,
  EnumModuleActionType,
  EnumModuleDtoType,
  EnumModuleActionGqlOperation,
  EnumModuleActionRestVerb,
  EnumModuleDtoPropertyType,
  EnumModuleActionRestInputSource,
} from "./models";

export enum EnumModuleDtoDecoratorType {
  ObjectType = "ObjectType",
  InputType = "InputType",
  ArgsType = "ArgsType",
}

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
  codeGeneratorVersionOptions: models.CodeGeneratorVersionOptionsInput;
  codeGeneratorName?: string;
  properties?: JsonValue;
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

/**
 * File is a representation of a file
 * @deprecated Use IFile instead
 * @see IFile
 * @see FileMap
 */
export type Module = IFile<string>;

/**
 * ModuleMap is a map of module paths to modules
 * @deprecated Use FileMap instead
 * @see FileMap
 */
export class ModuleMap extends FileMap<string> {
  constructor(logger: BuildLogger) {
    super(logger);
  }

  /**
   * Replace all modules paths using a function
   * @param fn A function that receives a module path and returns a new path
   */
  replaceModulesPath(fn: (path: string) => string): void {
    this.replaceFilesPath(fn);
  }
  /**
   * Replace all modules code using a function
   * @param fn A function that receives a module code and returns a new code
   */
  async replaceModulesCode(
    fn: (path: string, code: string) => string
  ): Promise<void> {
    await this.replaceFilesCode(fn);
  }
  /**
   * @returns An array of modules
   */
  modules(): Module[] {
    return Array.from(this.getAll());
  }
}

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
  countArgs: NamedClassDeclaration;
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

export type PropertyTypeDef = Omit<models.PropertyTypeDef, "type"> & {
  type: keyof typeof models.EnumModuleDtoPropertyType;
  dto?: ModuleDto;
};

export type PluginInstallation = BlockOmittedFields<models.PluginInstallation>;

export type Package = BlockOmittedFields<models.Package> & {
  displayName: string;
};

// export type PackageFile = {
//   package: Package;
//   path: string;
//   originalFileChecksum: string;
//   fullContent: string;
//   diff: string;
// };

export type ResourceSettings = BlockOmittedFields<models.ResourceSettings>;
export type Relation = BlockOmittedFields<models.Relation>;

export type ModuleContainer = BlockOmittedFields<models.Module>;

export type ModuleAction = Omit<
  BlockOmittedFields<models.ModuleAction>,
  | "id"
  | "actionType"
  | "restVerb"
  | "gqlOperation"
  | "inputType"
  | "outputType"
  | "restInputSource"
> & {
  id?: string;
  displayName: string;
  description: string;
  actionType: keyof typeof models.EnumModuleActionType;
  restVerb: keyof typeof models.EnumModuleActionRestVerb;
  gqlOperation: keyof typeof models.EnumModuleActionGqlOperation;
  inputType?: PropertyTypeDef;
  outputType?: PropertyTypeDef;
  restInputSource?: keyof typeof models.EnumModuleActionRestInputSource;
};

export type ModuleDtoProperty = Omit<
  models.ModuleDtoProperty,
  "propertyTypes"
> & {
  propertyTypes: PropertyTypeDef[];
};

export type ModuleDto = Omit<
  BlockOmittedFields<models.ModuleDto>,
  "id" | "dtoType" | "properties"
> & {
  id?: string;
  description: string;
  dtoType: keyof typeof models.EnumModuleDtoType;
  properties?: ModuleDtoProperty[];
  decorators?: EnumModuleDtoDecoratorType[];
};

export type ModuleActionDefaultTypesNestedOnly = Extract<
  models.EnumModuleActionType,
  | models.EnumModuleActionType.ChildrenConnect
  | models.EnumModuleActionType.ChildrenDisconnect
  | models.EnumModuleActionType.ChildrenFind
  | models.EnumModuleActionType.ChildrenUpdate
  | models.EnumModuleActionType.ParentGet
>;

export type ModuleActionDefaultTypesWithoutNested = Exclude<
  models.EnumModuleActionType,
  ModuleActionDefaultTypesNestedOnly | models.EnumModuleActionType.Custom
>;

export type entityRelatedFieldDefaultActions = {
  [key in ModuleActionDefaultTypesNestedOnly]?: ModuleAction | undefined;
};

export type entityDefaultActions = {
  [key in ModuleActionDefaultTypesWithoutNested]?: ModuleAction | undefined;
};

type defaultDtoTypes = Exclude<
  models.EnumModuleDtoType,
  | models.EnumModuleDtoType.Custom
  | models.EnumModuleDtoType.CustomEnum
  | models.EnumModuleDtoType.Enum
  | models.EnumModuleDtoType.CreateNestedManyInput
  | models.EnumModuleDtoType.UpdateNestedManyInput
>;

type defaultDtoNestedTypes = Extract<
  models.EnumModuleDtoType,
  | models.EnumModuleDtoType.CreateNestedManyInput
  | models.EnumModuleDtoType.UpdateNestedManyInput
>;

export type entityDefaultDtos = {
  [key in defaultDtoTypes]: ModuleDto;
};

export type entityDefaultNestedDtos = {
  [key in defaultDtoNestedTypes]: ModuleDto | undefined;
};

export type entityActions = {
  entityDefaultActions: entityDefaultActions;
  relatedFieldsDefaultActions: Record<
    string, //field name
    entityRelatedFieldDefaultActions
  >;
  customActions: ModuleAction[];
};

export type EntityActionsMap = Record<
  string, //module name/ entity name
  entityActions
>;

export type ModuleActionsAndDtos = {
  moduleContainer: ModuleContainer;
  actions: ModuleAction[];
  dtos: ModuleDto[];
};

export type ModuleActionsAndDtosMap = Record<
  string, //module name
  ModuleActionsAndDtos
>;

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
  | "lockedByUser"
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

export type BuildContext = {
  buildId: string;
  resourceId: string;
  projectId: string;
  data: DSGResourceData;
};

export type EntityComponent = {
  name: string;
  file: namedTypes.File;
  modulePath: string;
};

export type EntityComponents = {
  new: EntityComponent;
  list: EntityComponent;
  edit: EntityComponent;
  show: EntityComponent;
};

export {
  EnumActionStepStatus,
  EnumAuthProviderType,
  EnumBlockType,
  EnumGitProvider,
  EnumPendingChangeAction,
  EnumPendingChangeOriginType,
  EnumResourceType,
  CodeGeneratorVersionStrategy,
  MessagePatternCreateInput,
  RedesignProjectMovedEntity,
  RedesignProjectNewService,
} from "./models";
