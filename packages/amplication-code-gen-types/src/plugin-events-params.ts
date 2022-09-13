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
    file: namedTypes.File;
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
    file: namedTypes.File;
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
