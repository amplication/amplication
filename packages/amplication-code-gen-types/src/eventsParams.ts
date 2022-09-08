import { Module } from "./code-gen-types";
import { Entity } from "./models";
import { EventParams } from "./plugin-generic";

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
