import { print } from "recast";
import { builders, namedTypes } from "ast-types";
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
  removeImportsTSIgnoreComments,
  NamedClassDeclaration,
  getMethods,
} from "../../../util/ast";
import {
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../util/field";
import { SRC_DIRECTORY } from "../../constants";
import { DTOs, getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import { createServiceId } from "../service/create-service";
import { createSelect } from "../controller/create-select";

const MIXIN_ID = builders.identifier("Mixin");
const templatePath = require.resolve("./resolver.template.ts");
const toOneTemplatePath = require.resolve("./to-one.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createResolverModule(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: DTOs,
  entityIdToName: Record<string, string>,
  entitiesByName: Record<string, Entity>
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.resolver.ts`;
  const file = await readFile(templatePath);

  const serviceId = createServiceId(entityType);
  const id = createResolverId(entityType);
  const entityDTOs = dtos[entity.name];
  const entityDTO = entityDTOs.entity;

  interpolate(file, {
    RESOLVER: id,
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    ENTITY_PLURAL_NAME: builders.stringLiteral(camelCase(entityType)),
    ENTITY_SINGULAR_NAME: builders.stringLiteral(
      camelCase(entity.pluralDisplayName)
    ),
    CREATE_MUTATION_NAME: builders.stringLiteral(`create${entityType}`),
    UPDATE_MUTATION_NAME: builders.stringLiteral(`update${entityType}`),
    DELETE_MUTATION_NAME: builders.stringLiteral(`delete${entityType}`),
    SELECT: createSelect(entityDTO, entity),
    CREATE_ARGS: dtos[entity.name].createArgs.id,
    UPDATE_ARGS: dtos[entity.name].updateArgs.id,
    DELETE_ARGS: dtos[entity.name].deleteArgs.id,
    FIND_MANY_ARGS: dtos[entity.name].findManyArgs.id,
    FIND_ONE_ARGS: dtos[entity.name].findOneArgs.id,
  });

  const classDeclaration = getClassDeclarationById(file, id);
  const toManyRelationFields = entity.fields.filter(isToManyRelationField);
  const toManyRelationMethods = (
    await Promise.all(
      toManyRelationFields.map((field) =>
        createToManyRelationMethods(
          field,
          entityDTO,
          entityType,
          dtos,
          entityIdToName,
          entitiesByName,
          serviceId
        )
      )
    )
  ).flat();
  const toOneRelationFields = entity.fields.filter(isOneToOneRelationField);
  const toOneRelationMethods = (
    await Promise.all(
      toOneRelationFields.map((field) =>
        createToOneRelationMethods(
          field,
          entityDTO,
          entityType,
          dtos,
          entityIdToName,
          entitiesByName,
          serviceId
        )
      )
    )
  ).flat();

  classDeclaration.body.body.push(
    ...toManyRelationMethods,
    ...toOneRelationMethods
  );

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

export function createResolverId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Resolver`);
}

async function createToOneRelationMethods(
  field: EntityLookupField,
  entityDTO: NamedClassDeclaration,
  entityType: string,
  dtos: DTOs,
  entityIdToName: Record<string, string>,
  entitiesByName: Record<string, Entity>,
  serviceId: namedTypes.Identifier
) {
  const toOneFile = await readFile(toOneTemplatePath);
  const { relatedEntityId } = field.properties;
  const relatedEntityName = entityIdToName[relatedEntityId];
  const relatedEntity = entitiesByName[relatedEntityName];
  const relatedEntityDTOs = dtos[relatedEntityName];

  interpolate(toOneFile, {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntityName),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntityName),
    PROPERTY: builders.identifier(field.name),
    FIND_ONE: builders.identifier(camelCase(relatedEntity.name)),
    ARGS: relatedEntityDTOs.findManyArgs.id,
    SELECT: createSelect(relatedEntityDTOs.entity, relatedEntity),
  });

  return getMethods(getClassDeclarationById(toOneFile, MIXIN_ID));
}

async function createToManyRelationMethods(
  field: EntityLookupField,
  entityDTO: NamedClassDeclaration,
  entityType: string,
  dtos: DTOs,
  entityIdToName: Record<string, string>,
  entitiesByName: Record<string, Entity>,
  serviceId: namedTypes.Identifier
) {
  const toManyFile = await readFile(toManyTemplatePath);
  const { relatedEntityId } = field.properties;
  const relatedEntityName = entityIdToName[relatedEntityId];
  const relatedEntity = entitiesByName[relatedEntityName];
  const relatedEntityDTOs = dtos[relatedEntityName];

  interpolate(toManyFile, {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntityName),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntityName),
    PROPERTY: builders.identifier(field.name),
    FIND_MANY: builders.identifier(camelCase(relatedEntity.pluralDisplayName)),
    ARGS: relatedEntityDTOs.findManyArgs.id,
    SELECT: createSelect(relatedEntityDTOs.entity, relatedEntity),
  });

  return getMethods(getClassDeclarationById(toManyFile, MIXIN_ID));
}
