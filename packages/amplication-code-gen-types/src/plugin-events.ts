import {
  CreateAdminModulesParams,
  CreateAuthModulesParams,
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
} from "./plugin-events-params";
import { EventNames, PluginEventType } from "./plugins-types";

export type Events = {
  [EventNames.CreateAuthModules]?: PluginEventType<CreateAuthModulesParams>;
  [EventNames.CreateAdminModules]?: PluginEventType<CreateAdminModulesParams>;
  [EventNames.CreateServer]?: PluginEventType<CreateServerParams>;
  [EventNames.CreateServerDotEnv]?: PluginEventType<CreateServerDotEnvParams>;
  [EventNames.CreateEntityService]?: PluginEventType<CreateEntityServiceParams>;
  [EventNames.CreateEntityServiceBase]?: PluginEventType<CreateEntityServiceBaseParams>;
  [EventNames.CreateEntityController]?: PluginEventType<CreateEntityControllerParams>;
  [EventNames.CreateEntityControllerBase]?: PluginEventType<CreateEntityControllerBaseParams>;
  [EventNames.CreateServerDockerCompose]?: PluginEventType<CreateServerDockerComposeParams>;
  [EventNames.CreateServerDockerComposeDB]?: PluginEventType<CreateServerDockerComposeDBParams>;
  [EventNames.CreatePrismaSchema]?: PluginEventType<CreatePrismaSchemaParams>;

  [EventNames.CreateMessageBroker]?: PluginEventType<CreateMessageBrokerParams>;
  [EventNames.CreateMessageBrokerTopicsEnum]?: PluginEventType<CreateMessageBrokerTopicsEnumParams>;
  [EventNames.CreateMessageBrokerNestJSModule]?: PluginEventType<CreateMessageBrokerNestJSModuleParams>;
  [EventNames.CreateMessageBrokerClientOptionsFactory]?: PluginEventType<CreateMessageBrokerClientOptionsFactoryParams>;
  [EventNames.CreateMessageBrokerService]?: PluginEventType<CreateMessageBrokerServiceParams>;
  [EventNames.CreateMessageBrokerServiceBase]?: PluginEventType<CreateMessageBrokerServiceBaseParams>;
  [EventNames.CreatePackageJson]?: PluginEventType<CreateServerPackageJsonParams>;
  [EventNames.CreateServerAppModule]?: PluginEventType<CreateServerAppModuleParams>;
};
