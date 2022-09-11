import { namedTypes } from "ast-types";
import { DTOs, Entity, EntityField, Module } from "./code-gen-types";
import { EventParams } from "./plugins-types";

export interface CreateServiceModulesParams extends EventParams {
  before: {
    entityName: string;
    entityType: string;
    entity: Entity;
    srcDirectory: string;
    serviceId: namedTypes.Identifier;
    serviceBaseId: namedTypes.Identifier;
    delegateId: namedTypes.Identifier;
    passwordFields: EntityField[];
    extraMapping: { [key: string]: any };
    dtos: DTOs;
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
    additionalVariables: VariableDictionary;
  };
}
