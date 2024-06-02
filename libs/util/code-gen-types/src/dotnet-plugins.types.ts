import type { Promisable } from "type-fest";
import { BuildLogger } from "./build-logger";
import {
  clientDirectories,
  DTOs,
  EntityActionsMap,
  ModuleActionsAndDtosMap,
  serverDirectories,
} from "./code-gen-types";
import { DSGResourceData } from "./dsg-resource-data";
import { FileMap } from "./files";
import { AstNode, Class } from "@amplication/csharp-ast";
import { DotnetEvents } from "./dotnet-plugin-events.types";

export interface EventParams {}

export type PluginBeforeEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T
) => Promisable<T>;

export type PluginAfterEvent<T extends EventParams, F extends AstNode> = (
  dsgContext: DsgContext,
  eventParams: T,
  files: FileMap<F>
) => Promisable<FileMap<F>>;

export interface PluginEventType<
  T extends EventParams,
  F extends AstNode = Class
> {
  before?: PluginBeforeEvent<T>;
  after?: PluginAfterEvent<T, F>;
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
  importStaticFiles: (
    source: string,
    basePath: string
  ) => Promise<FileMap<string>>;
}

export interface DsgContext extends DSGResourceData {
  /**
   * List of generated files.
   */
  files: FileMap<AstNode>;
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
  [K in DotnetEventNames]?: {
    before?: PluginBeforeEvent<EventParams>[];
    after?: PluginAfterEvent<EventParams, AstNode>[];
  };
};

export enum DotnetEventNames {
  CreateEntityController = "CreateEntityController",
  CreateEntityControllerBase = "CreateEntityControllerBase",
  CreateEntityGrpcController = "CreateEntityGrpcController",
  CreateEntityGrpcControllerBase = "CreateEntityGrpcControllerBase",
  CreateEntityControllerSpec = "CreateEntityControllerSpec",
  CreateServerAuth = "CreateServerAuth",
  CreateAdminDotEnv = "CreateAdminDotEnv",
  CreateAdminUI = "CreateAdminUI",
  CreateServer = "CreateServer",
  CreateServerAppModule = "CreateServerAppModule",
  CreateProgramFile = "CreateProgramFile",
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
  CreatePrismaSchema = "CreatePrismaSchema",
  CreateServerCsproj = "CreateServerCsproj",
  CreateServerAppsettings = "CreateServerAppsettings",
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
  CreateEntityInterface = "CreateEntityInterface",
  CreateEntityExtensions = "CreateEntityExtensions",
  CreateEntityModel = "CreateEntityModel",
  CreateResourceDbContextFile = "CreateResourceDbContextFile",
  CreateSeedDevelopmentDataFile = "CreateSeedDevelopmentDataFile",
  CreateControllerModuleFile = "CreateControllerModuleFile",
  CreateControllerBaseModuleFile = "CreateControllerBaseModuleFile",
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => DotnetEvents;
}
