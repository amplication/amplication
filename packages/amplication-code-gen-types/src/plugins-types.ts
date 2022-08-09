import { AppInfo, DTOs, Entity, Module, Role } from "./code-gen-types";

export interface DsgContext {
  appInfo: AppInfo;
  entities: Entity[];
  roles: Role[];
  modules: Module[];
  DTOs: DTOs;
}

export type PluginWrapper = (args: any[], func: () => void) => any

export interface EventParams {

}

export interface CreateServiceModulesParams extends EventParams {
  before: {
    entityName: string;
    entityType: string;
    entity: Entity;
    dtos: DTOs;
    srcDirectory: string;
    extraMapping: {[key: string]: any};
  };
  after: Module[]
}

export interface CreateControllerModulesParams extends EventParams {
  before: {
    appInfo: AppInfo;
    resource: string;
    entityName: string;
    entityType: string;
    entityServiceModule: string;
    entity: Entity;
    dtos: DTOs;
    srcDirectory: string;
    extraMapping: {[key: string]: any};
  };
  after: Module[]
}

export type Events = {
  createServiceModules: {
    before?: (dsgContext: DsgContext, eventParams: CreateServiceModulesParams["before"]) => CreateServiceModulesParams["before"];
    after?: (dsgContext: DsgContext, eventParams: CreateServiceModulesParams["after"]) => CreateServiceModulesParams["after"];
  };
  createControllerModules: {
    before?: (dsgContext: DsgContext, eventParams: CreateControllerModulesParams["before"]) => CreateControllerModulesParams["before"];
    after?: (dsgContext: DsgContext, eventParams: CreateControllerModulesParams["after"]) => CreateControllerModulesParams["after"];
  }
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
