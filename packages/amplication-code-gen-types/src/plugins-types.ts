import { AppInfo, DTOs, Entity, Module, Role } from "./code-gen-types";
import winston from "winston";
import {
  CreateAdminModulesParams,
  CreateAuthModulesParams,
  CreateControllerModulesParams,
  CreateServiceModulesParams,
} from "./eventsParams";
import { EventParams } from "./plugin-generic";

export interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}

export interface ContextUtil {
  skipDefaultBehavior: boolean;
  importStaticModules: (source: string, basePath: string) => Promise<Module[]>;
}
export interface DsgContext {
  appInfo: AppInfo;
  entities: Entity[];
  roles: Role[];
  modules: Module[];
  DTOs: DTOs;
  plugins: PluginMap;
  logger: winston.Logger;
  utils: ContextUtil;
}

export type PluginWrapper = (args: EventParams, func: () => void) => any;

export interface DsgPlugin {
  id?: string;
  name?: string;
  description?: string;
  packageName: string;
}

export type PluginMap = {
  [K in EventNames]?: {
    before?: (<T>(context: DsgContext, params: EventParams | Module[]) => T)[];
    after?: (<T>(context: DsgContext, modules: EventParams | Module[]) => T)[];
  };
};

export enum EventNames {
  CreateServiceModules = "createServiceModules",
  CreateControllerModules = "createControllerModules",
  CreateAuthModules = "createAuthModules",
  CreateAdminModules = "createAdminModules",
}

export type Events = {
  [EventNames.CreateServiceModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["before"]
    ) => CreateServiceModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["after"]
    ) => CreateServiceModulesParams["after"];
  };
  [EventNames.CreateControllerModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["before"]
    ) => CreateControllerModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["after"]
    ) => CreateControllerModulesParams["after"];
  };
  [EventNames.CreateAuthModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAuthModulesParams["before"]
    ) => CreateAuthModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateAuthModulesParams["after"]
    ) => void;
  };
  [EventNames.CreateAdminModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAdminModulesParams["before"]
    ) => CreateAdminModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateAdminModulesParams["after"]
    ) => void;
  };
};

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
