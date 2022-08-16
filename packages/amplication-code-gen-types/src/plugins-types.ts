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

export interface CreateAuthModulesParams extends EventParams {
  before: [srcDir: string, templatePath?: string];
  after: Module[];
}

export enum EventsName {
  CreateServiceModules = "createServiceModules",
  CreateControllerModules = "createControllerModules",
  CreateAuthModules = "createAuthModules",
}

export type EventName = EventsName;

export type Events = {
  [EventsName.CreateServiceModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["before"]
    ) => CreateServiceModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateServiceModulesParams["after"]
    ) => CreateServiceModulesParams["after"];
  };
  [EventsName.CreateControllerModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["before"]
    ) => CreateControllerModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateControllerModulesParams["after"]
    ) => CreateControllerModulesParams["after"];
  };
  [EventsName.CreateAuthModules]?: {
    before?: (
      dsgContext: DsgContext,
      eventParams: CreateAuthModulesParams["before"]
    ) => CreateAuthModulesParams["before"];
    after?: (
      dsgContext: DsgContext,
      eventParams: CreateAuthModulesParams["after"]
    ) => Promise<CreateAuthModulesParams["after"]>;
  };
};

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
