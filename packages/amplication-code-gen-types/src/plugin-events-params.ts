import { namedTypes } from "ast-types";
import {
  Entity,
  EntityField,
  EnumDataType,
  Module,
  NamedClassDeclaration,
} from "./code-gen-types";
import { EventParams } from "./plugins-types";
import {
  Generator,
  DataSource,
  ScalarField,
  ObjectField,
} from "prisma-schema-dsl-types";

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
export interface CreateEntityControllerSpecParams extends EventParams {
  entity: Entity;
  entityType: string;
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
  entityServiceModulePath: string;
  entityControllerModulePath: string;
  entityControllerBaseModulePath: string;
  controllerId: namedTypes.Identifier;
  serviceId: namedTypes.Identifier;
}

export interface CreateUserInfoParams extends EventParams {
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
  filePath: string;
}
export interface CreateTokenPayloadInterfaceParams extends EventParams {
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
  filePath: string;
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

export type CreateSchemaFieldResult = (ScalarField | ObjectField)[];

export type CreateSchemaFieldHandler = (
  field: EntityField,
  entity: Entity,
  fieldNamesCount?: Record<string, number>
) => CreateSchemaFieldResult;

export type CreateSchemaFieldsHandlers = {
  [key in EnumDataType]: CreateSchemaFieldHandler;
};
export interface CreatePrismaSchemaParams extends EventParams {
  entities: Entity[];
  dataSource: DataSource;
  clientGenerator: Generator;
  createFieldsHandlers: CreateSchemaFieldsHandlers;
}

export interface CreateMessageBrokerParams extends EventParams {}
export interface CreateMessageBrokerTopicsEnumParams extends EventParams {}
export interface CreateMessageBrokerNestJSModuleParams extends EventParams {}
export interface CreateMessageBrokerClientOptionsFactoryParams
  extends EventParams {}

export interface CreateMessageBrokerServiceParams extends EventParams {}
export interface CreateMessageBrokerServiceBaseParams extends EventParams {}
export interface CreateServerPackageJsonParams extends EventParams {
  fileContent: string;
  updateProperties: { [key: string]: any }[];
}

export interface CreateAdminUIPackageJsonParams extends EventParams {
  fileContent: string;
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
  controllerId: namedTypes.Identifier;
  serviceId: namedTypes.Identifier;
  resolverId: namedTypes.Identifier;
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
}

export interface CreateEntityModuleBaseParams extends EventParams {
  entityName: string;
  moduleBaseId: namedTypes.Identifier;
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
}

export interface CreateEntityResolverParams extends EventParams {
  template: namedTypes.File;
  entityName: string;
  entityServiceModule: string;
  serviceId: namedTypes.Identifier;
  resolverBaseId: namedTypes.Identifier;
  templateMapping: { [key: string]: any };
}

export interface CreateEntityResolverBaseParams extends EventParams {
  template: namedTypes.File;
  entityName: string;
  entityType: string;
  entityServiceModule: string;
  entity: Entity;
  serviceId: namedTypes.Identifier;
  resolverBaseId: namedTypes.Identifier;
  createArgs: NamedClassDeclaration | undefined;
  updateArgs: NamedClassDeclaration | undefined;
  createMutationId: namedTypes.Identifier;
  updateMutationId: namedTypes.Identifier;
  templateMapping: { [key: string]: any };
}
export interface CreateSwaggerParams extends EventParams {
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
  fileDir: string;
  outputFileName: string;
}

export interface CreateSeedParams extends EventParams {
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
  fileDir: string;
  outputFileName: string;
}
