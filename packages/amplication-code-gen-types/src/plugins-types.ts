import { AppInfo, DTOs, Entity, Module, Role } from "./code-gen-types";
import winston from "winston";

export interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}

export interface ContextUtil {
  setDsgPath: (path: string) => string;
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

export type PluginWrapper = (args: any[], func: () => void) => any;

export interface EventParams {}

export interface DsgPlugin {
  id?: string;
  name?: string;
  description?: string;
  packageName: string;
}

export type PluginMap = {
  [K in EventNames]?: {
    before?: (<T>(context: DsgContext, params: any) => T)[];
    after?: (<T>(context: DsgContext, params: any) => T)[];
  };
};

export interface CreateServiceModulesParams extends EventParams {
  before: {
    entityName: string;
    entityType: string;
    entity: Entity;
    srcDirectory: string;
    extraMapping: { [key: string]: any };
  };
  after: Module[];
}

export interface CreateControllerModulesParams extends EventParams {
  before: {
    resource: string;
    entityName: string;
    entityType: string;
    entityServiceModule: string;
    entity: Entity;
    srcDirectory: string;
    extraMapping: { [key: string]: any };
  };
  after: Module[];
}

export interface CreateAuthModulesParams extends EventParams {
  before: {
    srcDir: string;
  };
  after: Module[];
}

export interface CreateAdminModulesParams extends EventParams {
  before: {};
  after: Module[];
}

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
