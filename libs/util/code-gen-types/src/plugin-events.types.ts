import {
  CreateAdminUIParams,
  CreateServerAuthParams,
  CreateEntityControllerBaseParams,
  CreateEntityControllerParams,
  CreateEntityServiceBaseParams,
  CreateEntityServiceParams,
  CreateEntityResolverBaseParams,
  CreateEntityResolverParams,
  CreateMessageBrokerClientOptionsFactoryParams,
  CreateMessageBrokerNestJSModuleParams,
  CreateMessageBrokerParams,
  CreateMessageBrokerServiceBaseParams,
  CreateMessageBrokerServiceParams,
  CreateMessageBrokerTopicsEnumParams,
  CreatePrismaSchemaParams,
  CreateServerAppModuleParams,
  CreateServerDockerComposeDBParams,
  CreateServerDockerComposeParams,
  CreateServerDotEnvParams,
  CreateServerPackageJsonParams,
  CreateServerParams,
  CreateEntityModuleParams,
  CreateEntityModuleBaseParams,
  CreateSwaggerParams,
  CreateSeedParams,
  CreateEntityControllerSpecParams,
  CreateAdminUIPackageJsonParams,
  CreateEntityControllerToManyRelationMethodsParams,
  CreateEntityResolverToManyRelationMethodsParams,
  CreateEntityResolverToOneRelationMethodsParams,
  CreateServerGitIgnoreParams,
  CreateAdminGitIgnoreParams,
  CreateDTOsParams,
  LoadStaticFilesParams,
  CreateServerDockerComposeDevParams,
  CreateConnectMicroservicesParams,
  CreateAdminAppModuleParams,
  CreateAdminDotEnvParams,
  CreateEntityGrpcControllerToManyRelationMethodsParams,
  CreateEntityGrpcControllerParams,
  CreateEntityGrpcControllerBaseParams,
  CreateServerSecretsManagerParams,
  CreateMainFileParams,
} from "./plugin-events-params.types";
import { EventNames, PluginEventType } from "./plugins.types";

export type Events = {
  [EventNames.CreateServerAuth]?: PluginEventType<CreateServerAuthParams>;
  [EventNames.CreateAdminUI]?: PluginEventType<CreateAdminUIParams>;
  [EventNames.CreateServer]?: PluginEventType<CreateServerParams>;
  [EventNames.CreateServerDotEnv]?: PluginEventType<CreateServerDotEnvParams>;
  [EventNames.CreateAdminDotEnv]?: PluginEventType<CreateAdminDotEnvParams>;
  [EventNames.CreateServerGitIgnore]?: PluginEventType<CreateServerGitIgnoreParams>;
  [EventNames.CreateAdminGitIgnore]?: PluginEventType<CreateAdminGitIgnoreParams>;
  [EventNames.CreateEntityService]?: PluginEventType<CreateEntityServiceParams>;
  [EventNames.CreateEntityServiceBase]?: PluginEventType<CreateEntityServiceBaseParams>;
  [EventNames.CreateEntityController]?: PluginEventType<CreateEntityControllerParams>;
  [EventNames.CreateEntityControllerBase]?: PluginEventType<CreateEntityControllerBaseParams>;
  [EventNames.CreateEntityGrpcController]?: PluginEventType<CreateEntityGrpcControllerParams>;
  [EventNames.CreateEntityGrpcControllerBase]?: PluginEventType<CreateEntityGrpcControllerBaseParams>;
  [EventNames.CreateServerDockerCompose]?: PluginEventType<CreateServerDockerComposeParams>;
  [EventNames.CreateServerDockerComposeDB]?: PluginEventType<CreateServerDockerComposeDBParams>;
  [EventNames.CreateServerDockerComposeDev]?: PluginEventType<CreateServerDockerComposeDevParams>;
  [EventNames.CreatePrismaSchema]?: PluginEventType<CreatePrismaSchemaParams>;
  [EventNames.CreateMessageBroker]?: PluginEventType<CreateMessageBrokerParams>;
  [EventNames.CreateMessageBrokerTopicsEnum]?: PluginEventType<CreateMessageBrokerTopicsEnumParams>;
  [EventNames.CreateMessageBrokerNestJSModule]?: PluginEventType<CreateMessageBrokerNestJSModuleParams>;
  [EventNames.CreateMessageBrokerClientOptionsFactory]?: PluginEventType<CreateMessageBrokerClientOptionsFactoryParams>;
  [EventNames.CreateMessageBrokerService]?: PluginEventType<CreateMessageBrokerServiceParams>;
  [EventNames.CreateMessageBrokerServiceBase]?: PluginEventType<CreateMessageBrokerServiceBaseParams>;
  [EventNames.CreateServerPackageJson]?: PluginEventType<CreateServerPackageJsonParams>;
  [EventNames.CreateAdminUIPackageJson]?: PluginEventType<CreateAdminUIPackageJsonParams>;
  [EventNames.CreateServerAppModule]?: PluginEventType<CreateServerAppModuleParams>;
  [EventNames.CreateMainFile]?: PluginEventType<CreateMainFileParams>;
  [EventNames.CreateAdminAppModule]?: PluginEventType<CreateAdminAppModuleParams>;
  [EventNames.CreateConnectMicroservices]?: PluginEventType<CreateConnectMicroservicesParams>;
  [EventNames.CreateEntityModule]?: PluginEventType<CreateEntityModuleParams>;
  [EventNames.CreateEntityResolver]?: PluginEventType<CreateEntityResolverParams>;
  [EventNames.CreateEntityResolverBase]?: PluginEventType<CreateEntityResolverBaseParams>;
  [EventNames.CreateEntityModuleBase]?: PluginEventType<CreateEntityModuleBaseParams>;
  [EventNames.CreateSwagger]?: PluginEventType<CreateSwaggerParams>;
  [EventNames.CreateSeed]?: PluginEventType<CreateSeedParams>;
  [EventNames.CreateEntityControllerSpec]?: PluginEventType<CreateEntityControllerSpecParams>;
  [EventNames.CreateEntityControllerToManyRelationMethods]?: PluginEventType<CreateEntityControllerToManyRelationMethodsParams>;
  [EventNames.CreateEntityGrpcControllerToManyRelationMethods]?: PluginEventType<CreateEntityGrpcControllerToManyRelationMethodsParams>;
  [EventNames.CreateEntityResolverToManyRelationMethods]?: PluginEventType<CreateEntityResolverToManyRelationMethodsParams>;
  [EventNames.CreateEntityResolverToOneRelationMethods]?: PluginEventType<CreateEntityResolverToOneRelationMethodsParams>;
  [EventNames.CreateDTOs]?: PluginEventType<CreateDTOsParams>;
  [EventNames.LoadStaticFiles]?: PluginEventType<LoadStaticFilesParams>;
  [EventNames.CreateServerSecretsManager]?: PluginEventType<CreateServerSecretsManagerParams>;
};
