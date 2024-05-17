import {
  CreateDTOsParams,
  CreateEntityControllerBaseParams,
  CreateEntityControllerParams,
  CreateEntityControllerToManyRelationMethodsParams,
  CreateEntityGrpcControllerBaseParams,
  CreateEntityGrpcControllerParams,
  CreateEntityInterfaceParams,
  CreateEntityServiceBaseParams,
  CreateEntityServiceParams,
  CreateMainFileParams,
  CreateMessageBrokerClientOptionsFactoryParams,
  CreateMessageBrokerParams,
  CreateMessageBrokerServiceBaseParams,
  CreateMessageBrokerServiceParams,
  CreateMessageBrokerTopicsEnumParams,
  CreateSeedParams,
  CreateServerAuthParams,
  CreateServerCsprojParams,
  CreateServerDockerComposeDevParams,
  CreateServerDockerComposeParams,
  CreateServerDotEnvParams,
  CreateServerGitIgnoreParams,
  CreateServerParams,
  CreateServerSecretsManagerParams,
  CreateSwaggerParams,
  LoadStaticFilesParams,
} from "./dotnet-plugin-events-params.types";
import { DotnetEventNames, PluginEventType } from "./dotnet-plugins.types";
import { CodeBlock, Interface } from "@amplication/csharp-ast";

export type DotnetEvents = {
  [DotnetEventNames.CreateServerAuth]?: PluginEventType<CreateServerAuthParams>;
  [DotnetEventNames.CreateServer]?: PluginEventType<CreateServerParams>;
  [DotnetEventNames.CreateServerDotEnv]?: PluginEventType<
    CreateServerDotEnvParams,
    CodeBlock
  >;

  [DotnetEventNames.CreateServerGitIgnore]?: PluginEventType<
    CreateServerGitIgnoreParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateServerCsproj]?: PluginEventType<CreateServerCsprojParams>;
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
  [DotnetEventNames.CreateServerDockerComposeDev]?: PluginEventType<
    CreateServerDockerComposeDevParams,
    CodeBlock
  >;
  [DotnetEventNames.CreateMessageBroker]?: PluginEventType<CreateMessageBrokerParams>;
  [DotnetEventNames.CreateMessageBrokerTopicsEnum]?: PluginEventType<CreateMessageBrokerTopicsEnumParams>;
  [DotnetEventNames.CreateMessageBrokerClientOptionsFactory]?: PluginEventType<CreateMessageBrokerClientOptionsFactoryParams>;
  [DotnetEventNames.CreateMessageBrokerService]?: PluginEventType<CreateMessageBrokerServiceParams>;
  [DotnetEventNames.CreateMessageBrokerServiceBase]?: PluginEventType<CreateMessageBrokerServiceBaseParams>;
  [DotnetEventNames.CreateMainFile]?: PluginEventType<CreateMainFileParams>;
  [DotnetEventNames.CreateSwagger]?: PluginEventType<CreateSwaggerParams>;
  [DotnetEventNames.CreateSeed]?: PluginEventType<CreateSeedParams>;
  [DotnetEventNames.CreateEntityControllerToManyRelationMethods]?: PluginEventType<CreateEntityControllerToManyRelationMethodsParams>;
  [DotnetEventNames.CreateDTOs]?: PluginEventType<CreateDTOsParams>;
  [DotnetEventNames.LoadStaticFiles]?: PluginEventType<LoadStaticFilesParams>;
  [DotnetEventNames.CreateServerSecretsManager]?: PluginEventType<CreateServerSecretsManagerParams>;
  [DotnetEventNames.CreateEntityInterface]?: PluginEventType<
    CreateEntityInterfaceParams,
    Interface
  >;
};
