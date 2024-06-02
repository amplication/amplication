import type { Promisable } from "type-fest";
import { BuildLogger } from "./build-logger";
import {
  clientDirectories,
  DTOs,
  EntityActionsMap,
  ModuleActionsAndDtosMap,
  ModuleMap,
  serverDirectories,
} from "./code-gen-types";
import { DSGResourceData } from "./dsg-resource-data";
import { Events } from "./plugin-events.types";

export interface EventParams {}

export type PluginBeforeEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T
) => Promisable<T>;

export type PluginAfterEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T,
  modules: ModuleMap
) => Promisable<ModuleMap>;

export interface PluginEventType<T extends EventParams> {
  before?: PluginBeforeEvent<T>;
  after?: PluginAfterEvent<T>;
}

export interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}

export interface ContextUtil {
  skipDefaultBehavior: boolean;
  abortGeneration: (msg: string) => void;
  abortMessage?: string;
  abort: boolean;
  importStaticModules: (source: string, basePath: string) => Promise<ModuleMap>;
}

export interface DsgContext extends DSGResourceData {
  /**
   * List of generated files.
   */
  modules: ModuleMap;
  DTOs: DTOs;
  plugins: PluginMap;
  /**
   * Logger for user facing logs. Logs will be visible in the build log.
   */
  logger: BuildLogger;
  utils: ContextUtil;
  clientDirectories: clientDirectories;
  serverDirectories: serverDirectories;
  userEntityName: string;
  userNameFieldName: string;
  userPasswordFieldName: string;
  userRolesFieldName: string;
  entityActionsMap: EntityActionsMap;
  moduleActionsAndDtoMap: ModuleActionsAndDtosMap;
}

export type PluginWrapper = (args: EventParams, func: () => void) => any;

export type PluginMap = {
  [K in EventNames]?: {
    before?: PluginBeforeEvent<EventParams>[];
    after?: PluginAfterEvent<EventParams>[];
  };
};

export enum EventNames {
  CreateEntityController = "CreateEntityController",
  CreateEntityControllerBase = "CreateEntityControllerBase",
  CreateEntityGrpcController = "CreateEntityGrpcController",
  CreateEntityGrpcControllerBase = "CreateEntityGrpcControllerBase",
  CreateEntityControllerSpec = "CreateEntityControllerSpec",
  CreateServerAuth = "CreateServerAuth",
  CreateAdminAppModule = "CreateAdminAppModule",
  CreateAdminDotEnv = "CreateAdminDotEnv",
  CreateAdminUI = "CreateAdminUI",
  CreateServer = "CreateServer",
  CreateServerAppModule = "CreateServerAppModule",
  CreateMainFile = "CreateMainFile",
  CreateServerDotEnv = "CreateServerDotEnv",
  CreateServerGitIgnore = "CreateServerGitIgnore",
  CreateAdminGitIgnore = "CreateAdminGitIgnore",
  CreateMessageBroker = "CreateMessageBroker",
  CreateMessageBrokerTopicsEnum = "CreateMessageBrokerTopicsEnum",
  CreateMessageBrokerNestJSModule = "CreateMessageBrokerNestJSModule",
  CreateMessageBrokerClientOptionsFactory = "CreateMessageBrokerClientOptionsFactory",
  CreateMessageBrokerService = "CreateMessageBrokerService",
  CreateMessageBrokerServiceBase = "CreateMessageBrokerServiceBase",
  CreateEntityService = "CreateEntityService",
  CreateEntityServiceBase = "CreateEntityServiceBase",
  CreateServerDockerCompose = "CreateServerDockerCompose",
  CreateServerDockerComposeDB = "CreateServerDockerComposeDB",
  CreateServerDockerComposeDev = "CreateServerDockerComposeDev",
  CreatePrismaSchema = "CreatePrismaSchema",
  CreateServerPackageJson = "CreateServerPackageJson",
  CreateAdminUIPackageJson = "CreateAdminUIPackageJson",
  CreateEntityModule = "CreateEntityModule",
  CreateEntityModuleBase = "CreateEntityModuleBase",
  CreateEntityResolver = "CreateEntityResolver",
  CreateEntityResolverBase = "CreateEntityResolverBase",
  CreateSwagger = "CreateSwagger",
  CreateSeed = "CreateSeed",
  CreateEntityControllerToManyRelationMethods = "CreateEntityControllerToManyRelationMethods",
  CreateEntityGrpcControllerToManyRelationMethods = "createEntityGrpcControllerToManyRelationMethods",
  CreateEntityResolverToManyRelationMethods = "CreateEntityResolverToManyRelationMethods",
  CreateEntityResolverToOneRelationMethods = "CreateEntityResolverToOneRelationMethods",
  CreateDTOs = "CreateDTOs",
  LoadStaticFiles = "LoadStaticFiles",
  CreateConnectMicroservices = "CreateConnectMicroservices",
  /**
   * Event that will allow plugins to add secrets references to the SecretsKeyNames enum
   */
  CreateServerSecretsManager = "CreateServerSecretsManager",
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
