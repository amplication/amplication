import { Module } from "./code-gen-types";
import {
  CreateAdminModulesParams,
  CreateAuthModulesParams,
  CreateEntityBaseControllerParams,
  CreateEntityControllerParams,
  CreateEntityServiceBaseParams,
  CreateEntityServiceParams,
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
  [EventNames.CreateEntityBaseController]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateEntityBaseControllerParams["before"]
    ) => CreateEntityBaseControllerParams["before"];
    after?: (
      dsgContext: DsgContext,
      modules: CreateEntityBaseControllerParams["after"]
    ) => Module[];
  };
};
