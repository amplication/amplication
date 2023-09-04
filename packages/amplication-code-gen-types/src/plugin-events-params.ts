import type { namedTypes } from "ast-types";
import {
  DTOs,
  Entity,
  EntityField,
  EntityLookupField,
  EnumDataType,
  ModuleMap,
  NamedClassDeclaration,
} from "./code-gen-types";
import { EventParams } from "./plugins-types";
import type {
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

export interface CreateEntityControllerToManyRelationMethodsParams
  extends EventParams {
  field: EntityLookupField;
  entity: Entity;
  entityType: string;
  whereUniqueInput: NamedClassDeclaration;
  serviceId: namedTypes.Identifier;
  methods: namedTypes.ClassMethod[];
  toManyFile: namedTypes.File;
  toManyMapping: { [key: string]: any };
}

export interface CreateEntityResolverToManyRelationMethodsParams
  extends EventParams {
  field: EntityLookupField;
  entityType: string;
  serviceId: namedTypes.Identifier;
  methods: namedTypes.ClassMethod[];
  toManyFile: namedTypes.File;
  toManyMapping: { [key: string]: any };
}

export interface CreateEntityResolverToOneRelationMethodsParams
  extends EventParams {
  field: EntityLookupField;
  entityType: string;
  serviceId: namedTypes.Identifier;
  methods: namedTypes.ClassMethod[];
  toOneFile: namedTypes.File;
  toOneMapping: { [key: string]: any };
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

export interface CreateServerAuthParams extends EventParams {}

export interface CreateAdminUIParams extends EventParams {}
export interface CreateServerParams extends EventParams {}

export type VariableDictionary = {
  [variable: string]: string;
}[];

export interface CreateServerDotEnvParams extends EventParams {
  envVariables: VariableDictionary;
}

export interface CreateServerGitIgnoreParams extends EventParams {
  gitignorePaths: string[];
}
export interface CreateAdminGitIgnoreParams extends EventParams {
  gitignorePaths: string[];
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

export interface CreateServerDockerComposeDevParams extends EventParams {
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
  modulesFiles: ModuleMap;
  template: namedTypes.File;
  templateMapping: { [key: string]: any };
}

export interface CreateConnectMicroservicesParams extends EventParams {
  template: namedTypes.File;
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

export interface CreateDTOsParams extends EventParams {
  dtos: DTOs;
}

export interface LoadStaticFilesParams extends EventParams {
  source: string;
  basePath: string;
}
