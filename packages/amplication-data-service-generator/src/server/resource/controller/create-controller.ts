import { EnumEntityAction } from "./../../../models";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import {
  Entity,
  EntityLookupField,
  Module,
  NamedClassDeclaration,
  DTOs,
  EventNames,
  CreateEntityControllerParams,
  CreateEntityBaseControllerParams,
} from "@amplication/code-gen-types";
import { readFile, relativeImportPath } from "../../../util/module";
import {
  interpolate,
  importNames,
  addAutoGenerationComment,
  addImports,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  removeTSClassDeclares,
  getClassDeclarationById,
  removeESLintComments,
  importContainedIdentifiers,
  getMethods,
  removeTSIgnoreComments,
} from "../../../util/ast";
import { isToManyRelationField } from "../../../util/field";
import { getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import { createDataMapping } from "./create-data-mapping";
import { createSelect } from "./create-select";
import { getSwaggerAuthDecorationIdForClass } from "../../swagger/create-swagger";
import { setEndpointPermissions } from "../../../util/set-endpoint-permission";
import { IMPORTABLE_IDENTIFIERS_NAMES } from "../../../util/identifiers-imports";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";
import {
  createFieldFindManyFunctionId,
  createServiceId,
} from "../service/create-service";

export type MethodsIdsActionEntityTriplet = {
  methodId: namedTypes.Identifier;
  action: EnumEntityAction;
  entity: Entity;
};

const TO_MANY_MIXIN_ID = builders.identifier("Mixin");
export const DATA_ID = builders.identifier("data");

const templatePath = require.resolve("./controller.template.ts");
const baseTemplatePath = require.resolve("./controller.base.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createControllerModules(
  resource: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity
): Promise<Module[]> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { appInfo, DTOs } = DsgContext.getInstance;
  const { settings } = appInfo;
  const { authProvider } = settings;
  const entityDTOs = DTOs[entity.name];
  const entityDTO = entityDTOs.entity;

  const controllerId = createControllerId(entityType);
  const controllerBaseId = createControllerBaseId(entityType);
  const serviceId = createServiceId(entityType);
  const createEntityId = builders.identifier("create");
  const findManyEntityId = builders.identifier("findMany");
  const findOneEntityId = builders.identifier("findOne");
  const updateEntityId = builders.identifier("update");
  const deleteEntityId = builders.identifier("delete");

  const templateMapping = {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: controllerId,
    CONTROLLER_BASE: controllerBaseId,
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
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    UPDATE_PATH: builders.stringLiteral("/:id"),
    DELETE_PATH: builders.stringLiteral("/:id"),
    WHERE_UNIQUE_INPUT: entityDTOs.whereUniqueInput.id,

    SWAGGER_API_AUTH_FUNCTION: getSwaggerAuthDecorationIdForClass(authProvider),
  };

  return [
    ...(await pluginWrapper(
      createControllerModule,
      EventNames.CreateEntityController,
      {
        templatePath,
        entityName,
        entityServiceModule,
        templateMapping,
        controllerBaseId,
        serviceId,
      }
    )),
    ...(await pluginWrapper(
      createControllerBaseModule,
      EventNames.CreateEntityBaseController,
      {
        baseTemplatePath,
        entityName,
        entityType,
        entityServiceModule,
        entity,
        templateMapping,
        controllerBaseId,
        serviceId,
      }
    )),
  ];
}

async function createControllerModule({
  templatePath,
  entityName,
  entityServiceModule,
  templateMapping,
  controllerBaseId,
  serviceId,
}: CreateEntityControllerParams["before"]): Promise<Module[]> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/${entityName}.controller.ts`;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.controller.base.ts`;

  const file = await readFile(templatePath);

  interpolate(file, templateMapping);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );
  addImports(file, [
    serviceImport,
    importNames(
      [controllerBaseId],
      relativeImportPath(modulePath, moduleBasePath)
    ),
  ]);

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSClassDeclares(file);

  return [
    {
      path: modulePath,
      code: print(file).code,
    },
  ];
}

async function createControllerBaseModule({
  baseTemplatePath,
  entityName,
  entityType,
  entityServiceModule,
  entity,
  templateMapping,
  controllerBaseId,
  serviceId,
}: CreateEntityBaseControllerParams["before"]): Promise<Module[]> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DTOs, serverDirectories } = DsgContext.getInstance;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.controller.base.ts`;
  const file = await readFile(baseTemplatePath);

  const entityDTOs = DTOs[entity.name];

  interpolate(file, templateMapping);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(moduleBasePath, entityServiceModule)
  );

  const classDeclaration = getClassDeclarationById(file, controllerBaseId);
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
          serviceId
        )
      )
    )
  ).flat();

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

  const dtoNameToPath = getDTONameToPath(DTOs, serverDirectories.srcDirectory);
  const dtoImports = importContainedIdentifiers(
    file,
    getImportableDTOs(moduleBasePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    file,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(file, [serviceImport, ...identifiersImports, ...dtoImports]);

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSClassDeclares(file);
  addAutoGenerationComment(file);

  return [
    {
      path: moduleBasePath,
      code: print(file).code,
    },
  ];
}

export function createControllerId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Controller`);
}

export function createControllerBaseId(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}ControllerBase`);
}

async function createToManyRelationMethods(
  field: EntityLookupField,
  entity: Entity,
  entityType: string,
  whereUniqueInput: NamedClassDeclaration,
  dtos: DTOs,
  serviceId: namedTypes.Identifier
) {
  const toManyFile = await readFile(toManyTemplatePath);
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

  interpolate(toManyFile, toManyMapping);

  const classDeclaration = getClassDeclarationById(
    toManyFile,
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

  return getMethods(classDeclaration);
}
