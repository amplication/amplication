import { Promisable } from "type-fest";
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
import { DsgContext, EventNames, PluginEventType } from "./plugins-types";

export type Events = {
  [EventNames.CreateAuthModules]?: PluginEventType<CreateAuthModulesParams>;
  [EventNames.CreateAdminModules]?: PluginEventType<CreateAdminModulesParams>;
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
};
