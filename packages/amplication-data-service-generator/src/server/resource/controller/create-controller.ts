import { print } from "recast";
import { ASTNode, builders, namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import { Entity, EntityLookupField, Module } from "../../../types";
import { readFile, relativeImportPath } from "../../../util/module";
import {
  interpolate,
  importNames,
  addImports,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  removeTSClassDeclares,
  getClassDeclarationById,
  removeESLintComments,
  importContainedIdentifiers,
  getMethods,
  NamedClassDeclaration,
  removeTSIgnoreComments,
} from "../../../util/ast";
import { isToManyRelationField } from "../../../util/field";
import { SRC_DIRECTORY } from "../../constants";
import { DTOs, getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import {
  createServiceId,
  createFieldFindManyFunctionId,
} from "../service/create-service";
import { createDataMapping } from "./create-data-mapping";
import { createSelect } from "./create-select";

const TO_MANY_MIXIN_ID = builders.identifier("Mixin");
export const DATA_ID = builders.identifier("data");

const controllerTemplatePath = require.resolve("./controller.template.ts");
const controllerBaseTemplatePath = require.resolve(
  "./controller.base.template.ts"
);
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createControllerModules(
  resource: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: DTOs
): Promise<Module[]> {
  const entityDTOs = dtos[entity.name];
  const entityDTO = entityDTOs.entity;

  const controllerId = createControllerId(entityType);
  const controllerBaseId = createControllerBaseId(entityType);
  const serviceId = createServiceId(entityType);

  const mapping = {
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
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    UPDATE_PATH: builders.stringLiteral("/:id"),
    DELETE_PATH: builders.stringLiteral("/:id"),
    WHERE_UNIQUE_INPUT: entityDTOs.whereUniqueInput.id,
  };
  return [
    await createControllerModule(
      controllerTemplatePath,
      entityName,
      entityType,
      entityServiceModule,
      entity,
      dtos,
      mapping,
      controllerBaseId,
      serviceId,
      false
    ),
    await createControllerModule(
      controllerBaseTemplatePath,
      entityName,
      entityType,
      entityServiceModule,
      entity,
      dtos,
      mapping,
      controllerBaseId,
      serviceId,
      true
    ),
  ];
}

async function createControllerModule(
  templatePath: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: DTOs,
  mapping: { [key: string]: ASTNode | undefined },
  controllerBaseId: namedTypes.Identifier,
  serviceId: namedTypes.Identifier,
  isBaseClass: boolean
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.controller.ts`;
  const moduleBasePath = `${SRC_DIRECTORY}/${entityName}/base/${entityName}.controller.base.ts`;
  const file = await readFile(templatePath);

  const entityDTOs = dtos[entity.name];

  interpolate(file, mapping);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(
      isBaseClass ? moduleBasePath : modulePath,
      entityServiceModule
    )
  );

  if (isBaseClass) {
    const classDeclaration = getClassDeclarationById(file, controllerBaseId);
    const toManyRelationFields = entity.fields.filter(isToManyRelationField);
    const toManyRelationMethods = (
      await Promise.all(
        toManyRelationFields.map((field) =>
          createToManyRelationMethods(
            field,
            entityType,
            entityDTOs.whereUniqueInput,
            dtos,
            serviceId
          )
        )
      )
    ).flat();

    classDeclaration.body.body.push(...toManyRelationMethods);

    const dtoNameToPath = getDTONameToPath(dtos);
    const dtoImports = importContainedIdentifiers(
      file,
      getImportableDTOs(moduleBasePath, dtoNameToPath)
    );
    addImports(file, [serviceImport, ...dtoImports]);
  }

  if (!isBaseClass) {
    addImports(file, [
      serviceImport,
      importNames(
        [controllerBaseId],
        relativeImportPath(modulePath, moduleBasePath)
      ),
    ]);
  }

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSClassDeclares(file);

  return {
    path: isBaseClass ? moduleBasePath : modulePath,
    code: print(file).code,
  };
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
  entityType: string,
  whereUniqueInput: NamedClassDeclaration,
  dtos: DTOs,
  serviceId: namedTypes.Identifier
) {
  const toManyFile = await readFile(toManyTemplatePath);
  const { relatedEntity } = field.properties;
  const relatedEntityDTOs = dtos[relatedEntity.name];

  interpolate(toManyFile, {
    RELATED_ENTITY_WHERE_UNIQUE_INPUT: relatedEntityDTOs.whereUniqueInput.id,
    RELATED_ENTITY_WHERE_INPUT: relatedEntityDTOs.whereInput.id,
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    WHERE_UNIQUE_INPUT: whereUniqueInput.id,
    SERVICE: serviceId,
    ENTITY_NAME: builders.stringLiteral(entityType),
    FIND_PROPERTY: createFieldFindManyFunctionId(field.name),
    PROPERTY: builders.identifier(field.name),
    FIND_MANY: builders.identifier(camelCase(`findMany ${field.name}`)),
    FIND_MANY_PATH: builders.stringLiteral(`/:id/${field.name}`),
    CREATE: builders.identifier(camelCase(`create ${field.name}`)),
    CREATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
    DELETE: builders.identifier(camelCase(`delete ${field.name}`)),
    DELETE_PATH: builders.stringLiteral(`/:id/${field.name}`),
    UPDATE: builders.identifier(camelCase(`update ${field.name}`)),
    UPDATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
    SELECT: createSelect(relatedEntityDTOs.entity, relatedEntity),
  });

  return getMethods(getClassDeclarationById(toManyFile, TO_MANY_MIXIN_ID));
}
