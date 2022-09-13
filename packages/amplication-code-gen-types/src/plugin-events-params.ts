import { namedTypes } from "ast-types";
import {
  DTOs,
  Entity,
  EntityField,
  Module,
  NamedClassDeclaration,
} from "./code-gen-types";
import { EventParams } from "./plugins-types";

export interface CreateEntityServiceBaseParams extends EventParams {
  before: {
    entityName: string;
    entity: Entity;
    templateMapping: { [key: string]: any };
    passwordFields: EntityField[];
    srcDirectory: string;
    serviceId: namedTypes.Identifier;
    serviceBaseId: namedTypes.Identifier;
    delegateId: namedTypes.Identifier;
    entityDTO: NamedClassDeclaration;
    dtos: DTOs;
    template: namedTypes.File;
  };
}

export interface CreateEntityServiceParams extends EventParams {
  before: {
    entityName: string;
    templateMapping: { [key: string]: any };
    passwordFields: EntityField[];
    srcDirectory: string;
    serviceId: namedTypes.Identifier;
    serviceBaseId: namedTypes.Identifier;
    template: namedTypes.File;
  };
}
export interface CreateEntityControllerParams extends EventParams {
  before: {
    templatePath: string;
    entityName: string;
    entityServiceModule: string;
    srcDirectory: string;
    templateMapping: { [key: string]: any };
    controllerBaseId: namedTypes.Identifier;
    serviceId: namedTypes.Identifier;
  };
}

export interface CreateEntityBaseControllerParams extends EventParams {
  before: {
    baseTemplatePath: string;
    entity: Entity;
    entityName: string;
    entityType: string;
    entityServiceModule: string;
    srcDirectory: string;
    templateMapping: { [key: string]: any };
    controllerBaseId: namedTypes.Identifier;
    serviceId: namedTypes.Identifier;
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
