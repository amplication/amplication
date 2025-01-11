import {
  print,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import {
  Entity,
  EntityLookupField,
  Module,
  NamedClassDeclaration,
  DTOs,
  EventNames,
  EnumEntityAction,
  ModuleMap,
  CreateEntityGrpcControllerParams,
  CreateEntityGrpcControllerBaseParams,
  CreateEntityGrpcControllerToManyRelationMethodsParams,
} from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../utils/module";

import {
  interpolate,
  importNames,
  addAutoGenerationComment,
  addImports,
  getClassDeclarationById,
  importContainedIdentifiers,
  getMethods,
} from "../../../utils/ast";
import { isToManyRelationField } from "@amplication/dsg-utils";
import { getImportableDTOs } from "../dto/create-dto-module";
import { getSwaggerAuthDecorationIdForClass } from "../../swagger/create-swagger";
import { IMPORTABLE_IDENTIFIERS_NAMES } from "../../../utils/identifiers-imports";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import {
  createFieldFindManyFunctionId,
  createServiceId,
  createUpdateFunctionId,
} from "../service/create-service";
import { setEndpointPermissions } from "../../../utils/set-endpoint-permission";
import { createSelect } from "../controller/create-select";
import { createDataMapping } from "../controller/create-data-mapping";

export type MethodsIdsActionEntityTriplet = {
  methodId: namedTypes.Identifier;
  action: EnumEntityAction;
  entity: Entity;
};
const TO_MANY_MIXIN_ID = builders.identifier("Mixin");
export const DATA_ID = builders.identifier("data");

const toManyFile = undefined;
const GRPC_GENERATE_ERROR =
  "gRPC template is undefined, can't generate gRPC controllers, aborting the code generation process";

export async function createGrpcControllerModules(
  resource: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { appInfo, DTOs, entityActionsMap } = DsgContext.getInstance;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const entityDTOs = DTOs[entity.name];
  const entityDTO = entityDTOs.entity;

  const template = undefined;
  const templateBase = undefined;
  const entityActions = entityActionsMap[entity.name];

  const controllerId = createGrpcControllerId(entityType);
  const controllerBaseId = createGrpcControllerBaseId(entityType);
  const serviceId = createServiceId(entityType);
  const createEntityId = builders.identifier(
    entityActions.entityDefaultActions.Create.name
  );
  const findManyEntityId = builders.identifier(
    entityActions.entityDefaultActions.Find.name
  );
  const findOneEntityId = builders.identifier(
    entityActions.entityDefaultActions.Read.name
  );
  const updateEntityId = builders.identifier(
    entityActions.entityDefaultActions.Update.name
  );
  const deleteEntityId = builders.identifier(
    entityActions.entityDefaultActions.Delete.name
  );

  const templateMapping = {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER_GRPC: controllerId,
    CONTROLLER_GRPC_BASE: controllerBaseId,
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    SELECT: createSelect(entityDTO, entity),

    CREATE_INPUT: entityDTOs.createInput.id,
    CREATE_DATA_MAPPING: createDataMapping(
      entity,
      entityDTOs.createInput,
      DATA_ID
    ),
    UPDATE_INPUT: entityDTOs.updateInput.id,
    UPDATE_DATA_MAPPING: createDataMapping(
      entity,
      entityDTOs.updateInput,
      DATA_ID
    ),
    FIND_MANY_ARGS: entityDTOs.findManyArgs.id,
    WHERE_INPUT: entityDTOs.whereInput.id,
    CREATE_ENTITY_FUNCTION: createEntityId,
    FIND_MANY_ENTITY_FUNCTION: findManyEntityId,
    FIND_ONE_ENTITY_FUNCTION: findOneEntityId,
    UPDATE_ENTITY_FUNCTION: updateEntityId,
    DELETE_ENTITY_FUNCTION: deleteEntityId,
    CREATE_FUNCTION: createEntityId,
    FIND_MANY_FUNCTION: findManyEntityId,
    FIND_ONE_FUNCTION: findOneEntityId,
    UPDATE_FUNCTION: updateEntityId,
    DELETE_FUNCTION: deleteEntityId,
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    UPDATE_PATH: builders.stringLiteral("/:id"),
    DELETE_PATH: builders.stringLiteral("/:id"),
    WHERE_UNIQUE_INPUT: entityDTOs.whereUniqueInput.id,

    SWAGGER_API_AUTH_FUNCTION: getSwaggerAuthDecorationIdForClass(authProvider),
  };
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  const grpcControllerModule = await pluginWrapper(
    createGrpcControllerModule,
    EventNames.CreateEntityGrpcController,
    {
      template,
      entityName,
      entityServiceModule,
      templateMapping,
      controllerBaseId,
      serviceId,
      dtoNameToPath,
    } as CreateEntityGrpcControllerParams
  );

  const grpcControllerBaseModule = await pluginWrapper(
    createGrpcControllerBaseModule,
    EventNames.CreateEntityGrpcControllerBase,
    {
      template: templateBase,
      entityName,
      entityType,
      entityServiceModule,
      entity,
      templateMapping,
      controllerBaseId,
      serviceId,
      dtoNameToPath,
    } as CreateEntityGrpcControllerBaseParams
  );
  if (!grpcControllerModule || !grpcControllerBaseModule) return moduleMap;

  await moduleMap.mergeMany([grpcControllerModule, grpcControllerBaseModule]);

  return moduleMap;
}

async function createGrpcControllerModule({
  template,
  entityName,
  entityServiceModule,
  templateMapping,
  controllerBaseId,
  serviceId,
}: CreateEntityGrpcControllerParams): Promise<ModuleMap> {
  const { serverDirectories, generateGrpc } = DsgContext.getInstance;
  if (generateGrpc && !template) {
    throw new Error(GRPC_GENERATE_ERROR);
  }
  if (!template) return;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/${entityName}.grpc.controller.ts`;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.grpc.controller.base.ts`;

  interpolate(template, templateMapping);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );
  addImports(template, [
    serviceImport,
    importNames(
      [controllerBaseId],
      relativeImportPath(modulePath, moduleBasePath)
    ),
  ]);

  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);
  removeTSInterfaceDeclares(template);
  removeTSClassDeclares(template);

  const module: Module = {
    path: modulePath,
    code: print(template).code,
  };
  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}

async function createGrpcControllerBaseModule({
  template,
  entityName,
  entityType,
  entityServiceModule,
  entity,
  templateMapping,
  controllerBaseId,
  serviceId,
  dtoNameToPath,
}: CreateEntityGrpcControllerBaseParams): Promise<ModuleMap> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DTOs, serverDirectories, generateGrpc } = DsgContext.getInstance;

  if (generateGrpc && !template) {
    throw new Error(GRPC_GENERATE_ERROR);
  }
  if (!template) return;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.grpc.controller.base.ts`;

  const entityDTOs = DTOs[entity.name];

  interpolate(template, templateMapping);

  const classDeclaration = getClassDeclarationById(template, controllerBaseId);
  const toManyRelationFields = entity.fields.filter(isToManyRelationField);
  const toManyRelationMethods = (
    await Promise.all(
      toManyRelationFields.map((field) =>
        createToManyRelationMethods(
          field,
          entity,
          entityType,
          entityDTOs.whereUniqueInput,
          DTOs,
          toManyFile,
          serviceId
        )
      )
    )
  ).flat();

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(moduleBasePath, entityServiceModule)
  );

  const methodsIdsActionPairs: MethodsIdsActionEntityTriplet[] = [
    {
      methodId: templateMapping[
        "CREATE_ENTITY_FUNCTION"
      ] as namedTypes.Identifier,
      action: EnumEntityAction.Create,
      entity: entity,
    },
    {
      methodId: templateMapping[
        "FIND_MANY_ENTITY_FUNCTION"
      ] as namedTypes.Identifier,
      action: EnumEntityAction.Search,
      entity: entity,
    },
    {
      methodId: templateMapping[
        "FIND_ONE_ENTITY_FUNCTION"
      ] as namedTypes.Identifier,
      action: EnumEntityAction.View,
      entity: entity,
    },
    {
      methodId: templateMapping[
        "UPDATE_ENTITY_FUNCTION"
      ] as namedTypes.Identifier,
      action: EnumEntityAction.Update,
      entity: entity,
    },
    {
      methodId: templateMapping[
        "DELETE_ENTITY_FUNCTION"
      ] as namedTypes.Identifier,
      action: EnumEntityAction.Delete,
      entity: entity,
    },
  ];

  methodsIdsActionPairs.forEach(({ methodId, action, entity }) => {
    setEndpointPermissions(classDeclaration, methodId, action, entity);
  });

  classDeclaration.body.body.push(...toManyRelationMethods);

  const dtoImports = importContainedIdentifiers(
    template,
    getImportableDTOs(moduleBasePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    template,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(template, [serviceImport, ...identifiersImports, ...dtoImports]);

  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);
  removeTSInterfaceDeclares(template);
  removeTSClassDeclares(template);
  addAutoGenerationComment(template);

  const module: Module = {
    path: moduleBasePath,
    code: print(template).code,
  };
  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}

export function createGrpcControllerId(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}GrpcController`);
}

export function createGrpcControllerBaseId(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}GrpcControllerBase`);
}

async function createToManyRelationMethods(
  field: EntityLookupField,
  entity: Entity,
  entityType: string,
  whereUniqueInput: NamedClassDeclaration,
  dtos: DTOs,
  toManyFile: namedTypes.File,
  serviceId: namedTypes.Identifier
) {
  const { relatedEntity } = field.properties;
  const relatedEntityDTOs = dtos[relatedEntity.name];

  const toManyMapping = {
    RELATED_ENTITY_WHERE_UNIQUE_INPUT: relatedEntityDTOs.whereUniqueInput.id,
    RELATED_ENTITY_WHERE_INPUT: relatedEntityDTOs.whereInput.id,
    RELATED_ENTITY_FIND_MANY_ARGS: relatedEntityDTOs.findManyArgs.id,
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    WHERE_UNIQUE_INPUT: whereUniqueInput.id,
    SERVICE: serviceId,
    ENTITY_NAME: builders.stringLiteral(entityType),
    FIND_PROPERTY: createFieldFindManyFunctionId(field.name),
    PROPERTY: builders.identifier(field.name),
    UPDATE_FUNCTION: createUpdateFunctionId(entityType),
    FIND_MANY: builders.identifier(camelCase(`findMany ${field.name}`)),
    FIND_MANY_PATH: builders.stringLiteral(`/:id/${field.name}`),
    CONNECT: builders.identifier(camelCase(`connect ${field.name}`)),
    CREATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
    DISCONNECT: builders.identifier(camelCase(`disconnect ${field.name}`)),
    DELETE_PATH: builders.stringLiteral(`/:id/${field.name}`),
    UPDATE: builders.identifier(camelCase(`update ${field.name}`)),
    UPDATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
    SELECT: createSelect(relatedEntityDTOs.entity, relatedEntity),
  };

  const eventParams: CreateEntityGrpcControllerToManyRelationMethodsParams = {
    field: field,
    entity: entity,
    entityType: entityType,
    whereUniqueInput: whereUniqueInput,
    serviceId: serviceId,
    methods: [],
    toManyFile: toManyFile,
    toManyMapping: toManyMapping,
  };

  await pluginWrapper(
    createToManyRelationMethodsInternal,
    EventNames.CreateEntityGrpcControllerToManyRelationMethods,
    eventParams
  );

  return eventParams.methods;
}

async function createToManyRelationMethodsInternal(
  eventParams: CreateEntityGrpcControllerToManyRelationMethodsParams
): Promise<ModuleMap> {
  const { generateGrpc } = DsgContext.getInstance;
  const { toManyMapping, entity, field } = eventParams;
  const toManyFile = eventParams.toManyFile;

  if (generateGrpc && !toManyFile) {
    throw new Error(GRPC_GENERATE_ERROR);
  }

  if (!toManyFile) return;
  const { relatedEntity } = field.properties;

  interpolate(toManyFile, toManyMapping);

  const classDeclaration = getClassDeclarationById(
    eventParams.toManyFile,
    TO_MANY_MIXIN_ID
  );

  const toManyMethodsIdsActionPairs: MethodsIdsActionEntityTriplet[] = [
    {
      methodId: toManyMapping["FIND_MANY"],
      action: EnumEntityAction.Search,
      entity: relatedEntity,
    },
    {
      methodId: toManyMapping["UPDATE"],
      action: EnumEntityAction.Update,
      entity: entity,
    },
    {
      methodId: toManyMapping["CONNECT"],
      action: EnumEntityAction.Update,
      entity: entity,
    },
    {
      methodId: toManyMapping["DISCONNECT"],
      action: EnumEntityAction.Delete,
      entity: entity,
    },
  ];

  toManyMethodsIdsActionPairs.forEach(({ methodId, action, entity }) => {
    setEndpointPermissions(classDeclaration, methodId, action, entity);
  });

  eventParams.methods = await getMethods(classDeclaration);

  return new ModuleMap(DsgContext.getInstance.logger);
}
