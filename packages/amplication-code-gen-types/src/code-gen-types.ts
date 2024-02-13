import type { namedTypes } from "ast-types";
import * as models from "./models";
import { Lookup, MultiSelectOptionSet, OptionSet } from "./types";
import { DSGResourceData } from "./dsg-resource-data";
import { BuildLogger } from "./build-logger";

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
} from "./models";

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

/**
 * ModuleMap is a map of module paths to modules
 */
export class ModuleMap {
  private map: Record<string, Module> = {};
  constructor(private readonly logger: BuildLogger) {}

  /**
   * Merge another map into this map
   *
   * @param anotherMap The map to merge into this map
   * @returns This map
   */
  async merge(anotherMap: ModuleMap): Promise<ModuleMap> {
    for await (const module of anotherMap.modules()) {
      await this.set(module);
    }

    return this;
  }

  /**
   * Merge many maps into this map
   * @param maps The maps to merge into this map
   * @returns This map
   * @see merge
   */
  async mergeMany(maps: ModuleMap[]): Promise<void> {
    const modules = maps.map((map) => map.modules()).flat();
    for await (const module of modules) {
      await this.set(module);
    }
  }

  /**
   * Set a module in the map. If the module already exists, it will be overwritten and a log message will be printed.
   * @param module The module (file) to add to the set
   */
  async set(module: Module) {
    if (this.map[module.path]) {
      await this.logger.warn(
        `Module ${module.path} already exists. Overwriting...`
      );
    }
    this.map[module.path] = module;
  }

  /**
   * @returns A module for the given path, or undefined if no module exists for the path
   */
  get(path: string) {
    return this.map[path];
  }

  /**
   * Replace a module in the map. If the module does not exist, it will be added to the set.
   * @param oldModule The module to replace
   * @param newModule The new module to replace the old module with
   */
  replace(oldModule: Module, newModule: Module): void {
    if (newModule.path !== oldModule.path) {
      delete this.map[oldModule.path];
    }
    this.map[newModule.path] = newModule;
  }

  /**
   * Replace all modules paths using a function
   * @param fn A function that receives a module path and returns a new path
   */
  replaceModulesPath(fn: (path: string) => string): void {
    for (const oldModule of this.modules()) {
      const newModule: Module = {
        ...oldModule,
        path: fn(oldModule.path),
      };
      this.replace(oldModule, newModule);
    }
  }

  /**
   * Remove modules from the map
   * @param paths An array of module paths to remove
   */
  removeMany(paths: string[]): void {
    for (const path of paths) {
      delete this.map[path];
    }
  }

  /**
   * Replace all modules code using a function
   * @param fn A function that receives a module code and returns a new code
   */
  async replaceModulesCode(
    fn: (path: string, code: string) => string
  ): Promise<void> {
    for await (const module of Object.values(this.map)) {
      module.code = fn(module.path, module.code);
      this.map[module.path] = module;
    }
  }

  /**
   * @returns An array of modules
   */
  modules(): Module[] {
    return Object.values(this.map);
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

export type ModuleContainer = BlockOmittedFields<models.Module>;

export type ModuleAction = Omit<
  BlockOmittedFields<models.ModuleAction>,
  "id" | "actionType" | "restVerb" | "gqlOperation" | "inputType" | "outputType"
> & {
  id?: string;
  displayName: string;
  description: string;
  actionType: keyof typeof models.EnumModuleActionType;
  restVerb: keyof typeof models.EnumModuleActionRestVerb;
  gqlOperation: keyof typeof models.EnumModuleActionGqlOperation;
  inputType?: PropertyTypeDef;
  outputType?: PropertyTypeDef;
  restInputSource?: "Query" | "Param" | "Body" | "Split";
  restInputParamPropertyName?: string;
  restInputBodyPropertyName?: string;
  restInputQueryPropertyName?: string;
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
  properties: ModuleDtoProperty[];
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
  [key in defaultDtoTypes]: ModuleDto | undefined;
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
