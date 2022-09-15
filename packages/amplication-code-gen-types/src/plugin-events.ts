import { Module } from "./code-gen-types";
import {
  CreateAdminModulesParams,
  CreateAuthModulesParams,
  CreateEntityControllerBaseParams,
  CreateEntityControllerParams,
  CreateEntityServiceBaseParams,
  CreateEntityServiceParams,
  CreatePrismaSchemaParams,
  CreateServerDockerComposeDBParams,
  CreateServerDockerComposeParams,
  CreateServerDotEnvParams,
} from "./plugin-events-params";
import { DsgContext, EventNames, PluginEventHookResult } from "./plugins-types";

export type Events = {
  [EventNames.CreateAuthModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAuthModulesParams["before"]
    ) => PluginEventHookResult<CreateAuthModulesParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateAuthModulesParams["after"]
    ) => Module[];
  };
  [EventNames.CreateAdminModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAdminModulesParams["before"]
    ) => PluginEventHookResult<CreateAdminModulesParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateAdminModulesParams["after"]
    ) => Module[];
  };
  [EventNames.CreateServerDotEnv]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDotEnvParams["before"]
    ) => PluginEventHookResult<CreateServerDotEnvParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDotEnvParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityService]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityServiceParams["before"]
    ) => PluginEventHookResult<CreateEntityServiceParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityServiceParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityServiceBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityServiceBaseParams["before"]
    ) => PluginEventHookResult<CreateEntityServiceBaseParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityServiceBaseParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityController]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityControllerParams["before"]
    ) => PluginEventHookResult<CreateEntityControllerParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityControllerParams["after"]
    ) => Module[];
  };
  [EventNames.CreateEntityControllerBase]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityControllerBaseParams["before"]
    ) => PluginEventHookResult<CreateEntityControllerBaseParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityControllerBaseParams["after"]
    ) => Module[];
  };
  [EventNames.CreateServerDockerCompose]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDockerComposeParams["before"]
    ) => PluginEventHookResult<CreateServerDockerComposeParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDockerComposeParams["after"]
    ) => Module[];
  };
  [EventNames.CreateServerDockerComposeDB]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServerDockerComposeDBParams["before"]
    ) => PluginEventHookResult<CreateServerDockerComposeDBParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreateServerDockerComposeDBParams["after"]
    ) => Module[];
  };
  [EventNames.CreatePrismaSchema]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreatePrismaSchemaParams["before"]
    ) => PluginEventHookResult<CreatePrismaSchemaParams["before"]>;
    after?: (
      dsgContext: DsgContext,
      modules: CreatePrismaSchemaParams["after"]
    ) => Module[];
  };
};
