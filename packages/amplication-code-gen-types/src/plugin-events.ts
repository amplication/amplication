import { Promisable } from "type-fest";
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
    ) => Promisable<CreateAuthModulesParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateAuthModulesParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateAdminModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAdminModulesParams["before"]
    ) => Promisable<CreateAdminModulesParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateAdminModulesParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateServerDotEnv]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDotEnvParams["before"]
    ) => Promisable<CreateServerDotEnvParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDotEnvParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateEntityService]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityServiceParams["before"]
    ) => Promisable<CreateEntityServiceParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityServiceParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateEntityServiceBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityServiceBaseParams["before"]
    ) => Promisable<CreateEntityServiceBaseParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityServiceBaseParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateEntityController]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityControllerParams["before"]
    ) => Promisable<CreateEntityControllerParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityControllerParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateEntityControllerBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityControllerBaseParams["before"]
    ) => Promisable<CreateEntityControllerBaseParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityControllerBaseParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateServerDockerCompose]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDockerComposeParams["before"]
    ) => Promisable<CreateServerDockerComposeParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDockerComposeParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateServerDockerComposeDB]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDockerComposeDBParams["before"]
    ) => Promisable<CreateServerDockerComposeDBParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDockerComposeDBParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreatePrismaSchema]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreatePrismaSchemaParams["before"]
    ) => Promisable<CreatePrismaSchemaParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreatePrismaSchemaParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateMessageBroker]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerParams["before"]
    ) => CreateMessageBrokerParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateMessageBrokerTopicsEnum]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerTopicsEnumParams["before"]
    ) => CreateMessageBrokerTopicsEnumParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerTopicsEnumParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateMessageBrokerNestJSModule]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerNestJSModuleParams["before"]
    ) => CreateMessageBrokerNestJSModuleParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerNestJSModuleParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateMessageBrokerClientOptionsFactory]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerClientOptionsFactoryParams["before"]
    ) => CreateMessageBrokerClientOptionsFactoryParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerClientOptionsFactoryParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateMessageBrokerService]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerServiceParams["before"]
    ) => CreateMessageBrokerServiceParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerServiceParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreateMessageBrokerServiceBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateMessageBrokerServiceBaseParams["before"]
    ) => CreateMessageBrokerServiceBaseParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateMessageBrokerServiceBaseParams["after"]
    ) => Promisable<Module[]>;
  };
  [EventNames.CreatePackageJson]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreatePackageJsonParams["before"]
    ) => CreatePackageJsonParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreatePackageJsonParams["after"]
    ) => Promisable<Module[]>;
  };
};
