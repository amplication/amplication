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
};
