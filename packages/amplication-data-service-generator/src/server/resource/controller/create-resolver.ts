import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import { Entity, EntityLookupField, Module } from "../../../types";
import { readFile, relativeImportPath } from "../../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  importNames,
  addImports,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  removeTSClassDeclares,
  findClassDeclarationById,
  isConstructor,
  removeESLintComments,
  importContainedIdentifiers,
} from "../../../util/ast";
import {
  PrismaAction,
  createPrismaArgsID,
} from "../../../util/prisma-code-generation";
import { isOneToOneRelationField, isRelationField } from "../../../util/field";
import { SRC_DIRECTORY } from "../../constants";
import { DTOs, getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import { createServiceId } from "../service/create-service";
import { createDataMapping } from "./create-data-mapping";
import { createSelect } from "./create-select";

const TO_MANY_MIXIN_ID = builders.identifier("Mixin");

const controllerTemplatePath = require.resolve("./controller.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createResolverModule(
  resource: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: DTOs,
  entityIdToName: Record<string, string>,
  entitiesByName: Record<string, Entity>
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.controller.ts`;
  const file = await readFile(controllerTemplatePath);

  const serviceId = createServiceId(entityType);
  const controllerId = createControllerId(entityType);
  const entityDTOs = dtos[entity.name];
  const entityDTO = entityDTOs.entity;

  interpolate(file, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: controllerId,
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    SELECT: createSelect(entityDTO, entity),
    CREATE_ARGS: createPrismaArgsID(PrismaAction.Create, entityType),
    /** @todo replace */
    CREATE_QUERY: builders.tsTypeLiteral([]),
    UPDATE_QUERY: builders.tsTypeLiteral([]),
    DELETE_QUERY: builders.tsTypeLiteral([]),
    CREATE_INPUT: entityDTOs.createInput.id,
    CREATE_DATA_MAPPING: createDataMapping(entity, entityDTOs.createInput),
    UPDATE_INPUT: entityDTOs.updateInput.id,
    UPDATE_DATA_MAPPING: createDataMapping(entity, entityDTOs.updateInput),
    /** @todo extend */
    WHERE_INPUT: entityDTOs.whereInput.id,
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    UPDATE_PATH: builders.stringLiteral("/:id"),
    DELETE_PATH: builders.stringLiteral("/:id"),
    /** @todo replace */
    FIND_ONE_QUERY: builders.tsTypeLiteral([]),
    WHERE_UNIQUE_INPUT: entityDTOs.whereUniqueInput.id,
  });

  const classDeclaration = findClassDeclarationById(file, controllerId);
  if (!classDeclaration) {
    throw new Error(`Could not find ${controllerId.name}`);
  }

  const toManyRelationships: EntityLookupField[] = entity.fields.filter(
    (field): field is EntityLookupField =>
      isRelationField(field) && !isOneToOneRelationField(field)
  );

  for (const field of toManyRelationships) {
    const toManyFile = await readFile(toManyTemplatePath);
    const relatedEntityId = field.properties.relatedEntityId;
    const relatedEntityName = entityIdToName[relatedEntityId];
    const relatedEntity = entitiesByName[relatedEntityName];
    const relatedEntityDTO = dtos[relatedEntityName].entity;
    const relatedEntityWhereUniqueInput =
      dtos[relatedEntityName].whereUniqueInput;
    const relatedEntityWhereInput = dtos[relatedEntityName].whereInput;
    interpolate(toManyFile, {
      RELATED_ENTITY_WHERE_UNIQUE_INPUT: relatedEntityWhereUniqueInput.id,
      RELATED_ENTITY_WHERE_INPUT: relatedEntityWhereInput.id,
      RELATED_ENTITY: builders.identifier(relatedEntityName),
      RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntityName),
      WHERE_UNIQUE_INPUT: entityDTOs.whereUniqueInput.id,
      SERVICE: serviceId,
      ENTITY_NAME: builders.stringLiteral(entityType),
      PROPERTY: builders.identifier(field.name),
      FIND_MANY: builders.identifier(camelCase(`findMany ${field.name}`)),
      FIND_MANY_PATH: builders.stringLiteral(`/:id/${field.name}`),
      CREATE: builders.identifier(camelCase(`create ${field.name}`)),
      CREATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
      DELETE: builders.identifier(camelCase(`delete ${field.name}`)),
      DELETE_PATH: builders.stringLiteral(`/:id/${field.name}`),
      UPDATE: builders.identifier(camelCase(`update ${field.name}`)),
      UPDATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
      SELECT: createSelect(relatedEntityDTO, relatedEntity),
    });
    const mixinClassDeclaration = findClassDeclarationById(
      toManyFile,
      TO_MANY_MIXIN_ID
    );
    if (!mixinClassDeclaration) {
      throw new Error(`Could not find ${TO_MANY_MIXIN_ID.name}`);
    }
    classDeclaration.body.body.push(
      ...mixinClassDeclaration.body.body.filter(
        (member) =>
          namedTypes.ClassMethod.check(member) && !isConstructor(member)
      )
    );
  }

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  const dtoNameToPath = getDTONameToPath(dtos);
  const dtoImports = importContainedIdentifiers(
    file,
    getImportableDTOs(modulePath, dtoNameToPath)
  );

  addImports(file, [serviceImport, ...dtoImports]);
  removeImportsTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSClassDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

export function createControllerId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Controller`);
}

function removeImportsTSIgnoreComments(file: namedTypes.File) {
  for (const statement of file.program.body) {
    if (!namedTypes.ImportDeclaration.check(statement)) {
      break;
    }
    removeTSIgnoreComments(statement);
  }
}
