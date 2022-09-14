import { Module } from "./code-gen-types";
import {
  CreateAdminModulesParams,
  CreateAuthModulesParams,
  CreateControllerModulesParams,
  CreateMessageBrokerClientOptionsFactoryParams,
  CreateMessageBrokerNestJSModuleParams,
  CreateMessageBrokerParams,
  CreateMessageBrokerTopicsEnumParams,
  CreateServerDotEnvParams,
  CreateServiceModulesParams,
} from "./plugin-events-params";
import { DsgContext, EventNames } from "./plugins-types";

export type Events = {
  [EventNames.CreateServiceModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["before"]
    ) => CreateServiceModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateServiceModulesParams["after"]
    ) => Module[];
  };
  [EventNames.CreateControllerModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["before"]
    ) => CreateControllerModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateControllerModulesParams["after"]
    ) => Module[];
  };
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
};
