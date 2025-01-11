import {
  CreateDTOsParams,
  CreateEntityControllerBaseParams,
  CreateEntityControllerParams,
  CreateEntityControllerToManyRelationMethodsParams,
  CreateEntityExtensionsParams,
  CreateEntityGrpcControllerBaseParams,
  CreateEntityGrpcControllerParams,
  CreateEntityInterfaceParams,
  CreateEntityModelParams,
  CreateEntityServiceBaseParams,
  CreateEntityServiceParams,
  CreateMessageBrokerClientOptionsFactoryParams,
  CreateMessageBrokerParams,
  CreateMessageBrokerServiceBaseParams,
  CreateMessageBrokerServiceParams,
  CreateMessageBrokerTopicsEnumParams,
  CreateProgramFileParams,
  CreateSeedParams,
  CreateServerAppsettingsParams,
  CreateServerAuthParams,
  CreateServerCsprojParams,
  CreateServerDockerComposeParams,
  CreateServerGitIgnoreParams,
  CreateServerParams,
  CreateServerSecretsManagerParams,
  CreateSwaggerParams,
  LoadStaticFilesParams,
  CreateResourceDbContextFileParams,
  CreateSeedDevelopmentDataFileParams,
  CreateControllerModuleFileParams,
  CreateControllerBaseModuleFileParams,
} from "./dotnet-plugin-events-params.types";
import { DotnetEventNames, PluginEventType } from "./dotnet-plugins.types";
import { CodeBlock, Interface, ProgramClass } from "@amplication/csharp-ast";

export type DotnetEvents = {
  [DotnetEventNames.CreateServerAuth]?: PluginEventType<CreateServerAuthParams>;
  [DotnetEventNames.CreateServer]?: PluginEventType<CreateServerParams>;
  [DotnetEventNames.CreateServerGitIgnore]?: PluginEventType<
    CreateServerGitIgnoreParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateServerCsproj]?: PluginEventType<
    CreateServerCsprojParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateServerAppsettings]?: PluginEventType<
    CreateServerAppsettingsParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateEntityService]?: PluginEventType<CreateEntityServiceParams>;
  [DotnetEventNames.CreateEntityServiceBase]?: PluginEventType<CreateEntityServiceBaseParams>;
  [DotnetEventNames.CreateEntityController]?: PluginEventType<CreateEntityControllerParams>;
  [DotnetEventNames.CreateEntityControllerBase]?: PluginEventType<CreateEntityControllerBaseParams>;
  [DotnetEventNames.CreateEntityGrpcController]?: PluginEventType<CreateEntityGrpcControllerParams>;
  [DotnetEventNames.CreateEntityGrpcControllerBase]?: PluginEventType<CreateEntityGrpcControllerBaseParams>;
  [DotnetEventNames.CreateServerDockerCompose]?: PluginEventType<
    CreateServerDockerComposeParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateMessageBroker]?: PluginEventType<CreateMessageBrokerParams>;
  [DotnetEventNames.CreateMessageBrokerTopicsEnum]?: PluginEventType<CreateMessageBrokerTopicsEnumParams>;
  [DotnetEventNames.CreateMessageBrokerClientOptionsFactory]?: PluginEventType<CreateMessageBrokerClientOptionsFactoryParams>;
  [DotnetEventNames.CreateMessageBrokerService]?: PluginEventType<CreateMessageBrokerServiceParams>;
  [DotnetEventNames.CreateMessageBrokerServiceBase]?: PluginEventType<CreateMessageBrokerServiceBaseParams>;
  [DotnetEventNames.CreateProgramFile]?: PluginEventType<
    CreateProgramFileParams,
    ProgramClass
  >;
  [DotnetEventNames.CreateSwagger]?: PluginEventType<CreateSwaggerParams>;
  [DotnetEventNames.CreateSeed]?: PluginEventType<CreateSeedParams>;
  [DotnetEventNames.CreateEntityControllerToManyRelationMethods]?: PluginEventType<CreateEntityControllerToManyRelationMethodsParams>;
  [DotnetEventNames.CreateDTOs]?: PluginEventType<CreateDTOsParams>;
  [DotnetEventNames.LoadStaticFiles]?: PluginEventType<
    LoadStaticFilesParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateServerSecretsManager]?: PluginEventType<CreateServerSecretsManagerParams>;
  [DotnetEventNames.CreateEntityInterface]?: PluginEventType<
    CreateEntityInterfaceParams,
    Interface
  >;
  [DotnetEventNames.CreateEntityExtensions]?: PluginEventType<CreateEntityExtensionsParams>;
  [DotnetEventNames.CreateEntityModel]?: PluginEventType<CreateEntityModelParams>;
  [DotnetEventNames.CreateResourceDbContextFile]?: PluginEventType<CreateResourceDbContextFileParams>;
  [DotnetEventNames.CreateSeedDevelopmentDataFile]?: PluginEventType<CreateSeedDevelopmentDataFileParams>;
  [DotnetEventNames.CreateControllerModuleFile]?: PluginEventType<CreateControllerModuleFileParams>;
  [DotnetEventNames.CreateControllerBaseModuleFile]?: PluginEventType<CreateControllerBaseModuleFileParams>;
};
