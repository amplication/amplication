import { Module } from "./code-gen-types";
import { Entity } from "./models";
import { EventParams } from "./plugins-types";

export interface CreateServiceModulesParams extends EventParams {
  before: {
    entityName: string;
    entityType: string;
    entity: Entity;
    srcDirectory: string;
    extraMapping: { [key: string]: any };
  };
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
}

export interface CreateAuthModulesParams extends EventParams {
  before: {
    srcDir: string;
  };
}

export interface CreateAdminModulesParams extends EventParams {
  before: {};
}

export type VariableDictionary = {
  [variable: string]: string;
}[];

export interface CreateServerDotEnvParams extends EventParams {
  before: {
    baseDirectory: string;
    envVariables: VariableDictionary;
  };
}
