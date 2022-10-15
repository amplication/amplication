import {
  CreateAdminUIParams,
  CreateServerAuthParams,
  CreateEntityControllerBaseParams,
  CreateEntityControllerParams,
  CreateEntityServiceBaseParams,
  CreateEntityServiceParams,
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
} from "./plugin-events-params";
import { EventNames, PluginEventType } from "./plugins-types";

export type Events = {
  [EventNames.CreateServerAuth]?: PluginEventType<CreateServerAuthParams>;
  [EventNames.CreateAdminUI]?: PluginEventType<CreateAdminUIParams>;
  [EventNames.CreateServer]?: PluginEventType<CreateServerParams>;
  [EventNames.CreateServerDotEnv]?: PluginEventType<CreateServerDotEnvParams>;
  [EventNames.CreateEntityService]?: PluginEventType<CreateEntityServiceParams>;
  [EventNames.CreateEntityServiceBase]?: PluginEventType<
    CreateEntityServiceBaseParams
  >;
  [EventNames.CreateEntityController]?: PluginEventType<
    CreateEntityControllerParams
  >;
  [EventNames.CreateEntityControllerBase]?: PluginEventType<
    CreateEntityControllerBaseParams
  >;
  [EventNames.CreateServerDockerCompose]?: PluginEventType<
    CreateServerDockerComposeParams
  >;
  [EventNames.CreateServerDockerComposeDB]?: PluginEventType<
    CreateServerDockerComposeDBParams
  >;
  [EventNames.CreatePrismaSchema]?: PluginEventType<CreatePrismaSchemaParams>;

  [EventNames.CreateMessageBroker]?: PluginEventType<CreateMessageBrokerParams>;
  [EventNames.CreateMessageBrokerTopicsEnum]?: PluginEventType<
    CreateMessageBrokerTopicsEnumParams
  >;
  [EventNames.CreateMessageBrokerNestJSModule]?: PluginEventType<
    CreateMessageBrokerNestJSModuleParams
  >;
  [EventNames.CreateMessageBrokerClientOptionsFactory]?: PluginEventType<
    CreateMessageBrokerClientOptionsFactoryParams
  >;
  [EventNames.CreateMessageBrokerService]?: PluginEventType<
    CreateMessageBrokerServiceParams
  >;
  [EventNames.CreateMessageBrokerServiceBase]?: PluginEventType<
    CreateMessageBrokerServiceBaseParams
  >;
  [EventNames.CreateServerPackageJson]?: PluginEventType<
    CreateServerPackageJsonParams
  >;
  [EventNames.CreateServerAppModule]?: PluginEventType<
    CreateServerAppModuleParams
  >;
  [EventNames.CreateEntityModule]?: PluginEventType<CreateEntityModuleParams>;
  [EventNames.CreateEntityModuleBase]?: PluginEventType<
    CreateEntityModuleBaseParams
  >;
};
