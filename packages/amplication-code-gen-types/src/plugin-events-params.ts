import { namedTypes } from "ast-types";

import {
  Entity,
  EntityField,
  Module,
  PrismaClientGenerator,
  PrismaDataSource,
} from "./code-gen-types";
import { EventParams } from "./plugins-types";

export interface CreateEntityServiceBaseParams extends EventParams {
  entityName: string;
  entity: Entity;
  templateMapping: { [key: string]: any };
  passwordFields: EntityField[];
  serviceId: namedTypes.Identifier;
  serviceBaseId: namedTypes.Identifier;
  delegateId: namedTypes.Identifier;
  template: namedTypes.File;
}

export interface CreateEntityServiceParams extends EventParams {
  entityName: string;
  templateMapping: { [key: string]: any };
  passwordFields: EntityField[];
  serviceId: namedTypes.Identifier;
  serviceBaseId: namedTypes.Identifier;
  template: namedTypes.File;
}
export interface CreateEntityControllerParams extends EventParams {
  template: namedTypes.File;
  entityName: string;
  entityServiceModule: string;
  templateMapping: { [key: string]: any };
  controllerBaseId: namedTypes.Identifier;
  serviceId: namedTypes.Identifier;
}
export interface CreateEntityControllerBaseParams extends EventParams {
  template: namedTypes.File;
  entity: Entity;
  entityName: string;
  entityType: string;
  entityServiceModule: string;
  templateMapping: { [key: string]: any };
  controllerBaseId: namedTypes.Identifier;
  serviceId: namedTypes.Identifier;
}
export interface CreateServerAuthParams extends EventParams {
  srcDir: string;
}

export interface CreateAdminUIParams extends EventParams {}
export interface CreateServerParams extends EventParams {}

export type VariableDictionary = {
  [variable: string]: string;
}[];

export interface CreateServerDotEnvParams extends EventParams {
  envVariables: VariableDictionary;
}

export interface CreateServerDockerComposeParams extends EventParams {
  fileContent: string;
  updateProperties: { [key: string]: any }[];
  outputFileName: string;
}

export interface CreateServerDockerComposeDBParams extends EventParams {
  fileContent: string;
  updateProperties: { [key: string]: any }[];
  outputFileName: string;
}
export interface CreatePrismaSchemaParams extends EventParams {
  entities: Entity[];
  dataSource: PrismaDataSource;
  clientGenerator: PrismaClientGenerator;
}

export interface CreateMessageBrokerParams extends EventParams {}
export interface CreateMessageBrokerTopicsEnumParams extends EventParams {}
export interface CreateMessageBrokerNestJSModuleParams extends EventParams {}
export interface CreateMessageBrokerClientOptionsFactoryParams
  extends EventParams {}

export interface CreateMessageBrokerServiceParams extends EventParams {}
export interface CreateMessageBrokerServiceBaseParams extends EventParams {}
export interface CreateServerPackageJsonParams extends EventParams {
  updateProperties: { [key: string]: any }[];
}

export interface CreateAdminUIPackageJsonParams extends EventParams {
  updateProperties: { [key: string]: any }[];
}

export interface CreateServerAppModuleParams extends EventParams {
  modulesFiles: Module[];
}

export interface CreateEntityModuleParams extends EventParams {
  entityName: string;
  entityType: string;
  entityServiceModule: string;
  entityControllerModule: string | undefined;
  entityResolverModule: string | undefined;
  moduleBaseId: namedTypes.Identifier;
}

export interface CreateEntityModuleBaseParams extends EventParams {
  entityName: string;
  moduleBaseId: namedTypes.Identifier;
}

export interface CreateSwaggerParams extends EventParams {
  template: namedTypes.File;
}

export interface CreateSeedParams extends EventParams {
  template: namedTypes.File;
}
