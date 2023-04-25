import { namedTypes } from "ast-types";
import * as models from "./models";
import { Lookup, MultiSelectOptionSet, OptionSet } from "./types";
import { DSGResourceData } from "./dsg-resource-data";
import { BuildLogger } from "./build-logger";
import { EventNames } from "./plugins-types";

export {
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType,
  EnumMessagePatternConnectionOptions,
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

  async merge(anotherMap: ModuleMap): Promise<void> {
    for await (const module of anotherMap.modules()) {
      await this.set(module.path, module);
    }
  }

  async mergeMany(maps: ModuleMap[]): Promise<void> {
    for await (const map of maps) {
      await this.merge(map);
    }
  }

  async set(path: string, module: Module) {
    if (this.map[path]) {
      await this.logger.warn(`Module ${path} already exists. Overwriting...`);
    }
    this.map[path] = module;
  }

  get(path: string) {
    return this.map[path];
  }

  replace(oldModule: Module, newModule: Module): void {
    if (newModule.path !== module.path) {
      delete this.map[oldModule.path];
    }
    this.map[newModule.path] = newModule;
  }

  /**
   * Replace all modules paths using a function
   * @param fn A function that receives a module path and returns a new path
   */
  async replaceModulesPath(fn: (path: string) => string): Promise<void> {
    for await (const oldModule of Object.values(this.map)) {
      const newModule: Module = {
        ...oldModule,
        path: fn(oldModule.path),
      };
      this.replace(oldModule, newModule);
    }
  }

  /**
   * Replace all modules code using a function
   * @param fn A function that receives a module code and returns a new code
   */
  async replaceModulesCode(fn: (code: string) => string): Promise<void> {
    for await (const module of Object.values(this.map)) {
      module.code = fn(module.code);
      this[module.path] = module;
    }
  }

  /**
   * Returns all modules in the map
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

export type BuildContext = {
  buildId: string;
  resourceId: string;
  projectId: string;
  data: DSGResourceData;
};
