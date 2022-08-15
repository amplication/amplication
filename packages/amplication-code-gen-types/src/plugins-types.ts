import { AppInfo, DTOs, Entity, Module, Role } from "./code-gen-types";

export interface DsgContext {
  appInfo: AppInfo;
  entities: Entity[];
  roles: Role[];
  modules: Module[];
  DTOs: DTOs;
  plugins: PluginMap;
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
  [K in EventsName]?: {
    before: (<T>(context: DsgContext, params: any) => T)[];
    after: (<T>(context: DsgContext, params: any) => T)[];
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

export enum EventsName {
  CreateServiceModules = "createServiceModules",
  CreateControllerModules = "createControllerModules"
}

export type EventName = EventsName;

export type Events = {
  createServiceModules?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["before"]
    ) => CreateServiceModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["after"]
    ) => CreateServiceModulesParams["after"];
  };
  createControllerModules?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["before"]
    ) => CreateControllerModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["after"]
    ) => CreateControllerModulesParams["after"];
  };
};

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
