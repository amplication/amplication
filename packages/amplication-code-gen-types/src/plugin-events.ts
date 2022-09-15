import { Module } from "./code-gen-types";
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
  CreatePackageJsonParams,
  CreatePrismaSchemaParams,
  CreateServerDockerComposeDBParams,
  CreateServerDockerComposeParams,
  CreateServerDotEnvParams,
} from "./plugin-events-params";
import { DsgContext, EventNames } from "./plugins-types";

export type Events = {
  [EventNames.CreateAuthModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAuthModulesParams["before"]
    ) => CreateAuthModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateAuthModulesParams["after"]
    ) => Module[];
  };
  [EventNames.CreateAdminModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAdminModulesParams["before"]
    ) => CreateAdminModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateAdminModulesParams["after"]
    ) => Module[];
  };
  [EventNames.CreateServerDotEnv]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDotEnvParams["before"]
    ) => CreateServerDotEnvParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDotEnvParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityService]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityServiceParams["before"]
    ) => CreateEntityServiceParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityServiceParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityServiceBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityServiceBaseParams["before"]
    ) => CreateEntityServiceBaseParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityServiceBaseParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityController]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityControllerParams["before"]
    ) => CreateEntityControllerParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityControllerParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityControllerBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityControllerBaseParams["before"]
    ) => CreateEntityControllerBaseParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityControllerBaseParams["after"]
    ) => Module[];
  };
  [EventNames.CreateServerDockerCompose]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDockerComposeParams["before"]
    ) => CreateServerDockerComposeParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDockerComposeParams["after"]
    ) => Module[];
  };
  [EventNames.CreateServerDockerComposeDB]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDockerComposeDBParams["before"]
    ) => CreateServerDockerComposeDBParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDockerComposeDBParams["after"]
    ) => Module[];
  };
  [EventNames.CreatePrismaSchema]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreatePrismaSchemaParams["before"]
    ) => CreatePrismaSchemaParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreatePrismaSchemaParams["after"]
    ) => Module[];
  };
  [EventNames.CreateMessageBroker]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerParams["before"]
    ) => CreateMessageBrokerParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerParams["after"]
    ) => Module[];
  };
  [EventNames.CreateMessageBrokerTopicsEnum]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerTopicsEnumParams["before"]
    ) => CreateMessageBrokerTopicsEnumParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerTopicsEnumParams["after"]
    ) => Module[];
  };
  [EventNames.CreateMessageBrokerNestJSModule]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerNestJSModuleParams["before"]
    ) => CreateMessageBrokerNestJSModuleParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerNestJSModuleParams["after"]
    ) => Module[];
  };
  [EventNames.CreateMessageBrokerClientOptionsFactory]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerClientOptionsFactoryParams["before"]
    ) => CreateMessageBrokerClientOptionsFactoryParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerClientOptionsFactoryParams["after"]
    ) => Module[];
  };
  [EventNames.CreateMessageBrokerService]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerServiceParams["before"]
    ) => CreateMessageBrokerServiceParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerServiceParams["after"]
    ) => Module[];
  };
  [EventNames.CreateMessageBrokerServiceBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerServiceBaseParams["before"]
    ) => CreateMessageBrokerServiceBaseParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerServiceBaseParams["after"]
    ) => Module[];
  };
  [EventNames.CreatePackageJson]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreatePackageJsonParams["before"]
    ) => CreatePackageJsonParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreatePackageJsonParams["after"]
    ) => Module[];
  };
};
