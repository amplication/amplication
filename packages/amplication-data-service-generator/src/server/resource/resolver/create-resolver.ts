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
  removeImportsTSIgnoreComments,
  NamedClassDeclaration,
  getMethods,
  deleteClassMemberByKey,
  memberExpression,
} from "../../../util/ast";
import {
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../util/field";
import { SRC_DIRECTORY } from "../../constants";
import { DTOs, getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import {
  createServiceId,
  createFieldFindManyFunctionId,
  createFieldFindOneFunctionId,
} from "../service/create-service";
import { createDataMapping } from "../controller/create-data-mapping";

const MIXIN_ID = builders.identifier("Mixin");
const DATA_MEMBER_EXPRESSION = memberExpression`args.data`;
const templatePath = require.resolve("./resolver.template.ts");
const templateBasePath = require.resolve("./resolver.base.template.ts");
const toOneTemplatePath = require.resolve("./to-one.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createResolverModules(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: DTOs
): Promise<Module[]> {
  const serviceId = createServiceId(entityType);
  const resolverId = createResolverId(entityType);
  const resolverBaseId = createResolverBaseId(entityType);
  const entityDTOs = dtos[entity.name];
  const {
    entity: entityDTO,
    createArgs,
    updateArgs,
    deleteArgs,
    findManyArgs,
    findOneArgs,
  } = entityDTOs;
  const createMutationId = builders.identifier(`create${entityType}`);
  const updateMutationId = builders.identifier(`update${entityType}`);
  const deleteMutationId = builders.identifier(`delete${entityType}`);
  const entityQueryId = builders.identifier(camelCase(entityType));
  const entitiesQueryId = builders.identifier(
    camelCase(entity.pluralDisplayName)
  );
  const metaQueryId = builders.identifier(
    `_${camelCase(entity.pluralDisplayName)}Meta`
  );

  const mapping = {
    RESOLVER: resolverId,
    RESOLVER_BASE: resolverBaseId,
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    ENTITY_QUERY: entityQueryId,
    ENTITIES_QUERY: entitiesQueryId,
    META_QUERY: metaQueryId,
    CREATE_MUTATION: createMutationId,
    UPDATE_MUTATION: updateMutationId,
    DELETE_MUTATION: deleteMutationId,
    CREATE_ARGS: createArgs?.id,
    UPDATE_ARGS: updateArgs?.id,
    DELETE_ARGS: deleteArgs.id,
    FIND_MANY_ARGS: findManyArgs.id,
    FIND_ONE_ARGS: findOneArgs.id,
    CREATE_DATA_MAPPING: createDataMapping(
      entity,
      entityDTOs.createInput,
      DATA_MEMBER_EXPRESSION
    ),
    UPDATE_DATA_MAPPING: createDataMapping(
      entity,
      entityDTOs.updateInput,
      DATA_MEMBER_EXPRESSION
    ),
  };

  return [
    await createResolverModule(
      templatePath,
      entityName,
      entityType,
      entityServiceModule,
      entity,
      dtos,
      entityDTO,
      serviceId,
      resolverBaseId,
      createArgs,
      updateArgs,
      createMutationId,
      updateMutationId,
      mapping,
      false
    ),
    await createResolverModule(
      templateBasePath,
      entityName,
      entityType,
      entityServiceModule,
      entity,
      dtos,
      entityDTO,
      serviceId,
      resolverBaseId,
      createArgs,
      updateArgs,
      createMutationId,
      updateMutationId,
      mapping,
      true
    ),
  ];
}

async function createResolverModule(
  templateFilePath: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: DTOs,
  entityDTO: NamedClassDeclaration,
  serviceId: namedTypes.Identifier,
  resolverBaseId: namedTypes.Identifier,
  createArgs: NamedClassDeclaration | undefined,
  updateArgs: NamedClassDeclaration | undefined,
  createMutationId: namedTypes.Identifier,
  updateMutationId: namedTypes.Identifier,
  mapping: { [key: string]: ASTNode | undefined },
  isBaseClass: boolean
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.resolver.ts`;
  const moduleBasePath = `${SRC_DIRECTORY}/${entityName}/base/${entityName}.resolver.base.ts`;
  const file = await readFile(templateFilePath);

  interpolate(file, mapping);

  if (isBaseClass) {
    const classDeclaration = getClassDeclarationById(file, resolverBaseId);
    const toManyRelationFields = entity.fields.filter(isToManyRelationField);
    const toManyRelationMethods = (
      await Promise.all(
        toManyRelationFields.map((field) =>
          createToManyRelationMethods(
            field,
            entityDTO,
            entityType,
            dtos,
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
            serviceId
          )
        )
      )
    ).flat();

    classDeclaration.body.body.push(
      ...toManyRelationMethods,
      ...toOneRelationMethods
    );

    if (!createArgs) {
      deleteClassMemberByKey(classDeclaration, createMutationId);
    }
    if (!updateArgs) {
      deleteClassMemberByKey(classDeclaration, updateMutationId);
    }
  }

  if (!isBaseClass) {
    addImports(file, [
      importNames(
        [resolverBaseId],
        relativeImportPath(modulePath, moduleBasePath)
      ),
    ]);
  }

  const dtoNameToPath = getDTONameToPath(dtos);
  const dtoImports = importContainedIdentifiers(
    file,
    getImportableDTOs(isBaseClass ? moduleBasePath : modulePath, dtoNameToPath)
  );
  addImports(file, [...dtoImports]);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(
      isBaseClass ? moduleBasePath : modulePath,
      entityServiceModule
    )
  );

  addImports(file, [serviceImport]);
  removeImportsTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSClassDeclares(file);

  return {
    path: isBaseClass ? moduleBasePath : modulePath,
    code: print(file).code,
  };
}

export function createResolverId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Resolver`);
}
export function createResolverBaseId(
  entityType: string
): namedTypes.Identifier {
  return builders.identifier(`${entityType}ResolverBase`);
}

async function createToOneRelationMethods(
  field: EntityLookupField,
  entityDTO: NamedClassDeclaration,
  entityType: string,
  dtos: DTOs,
  serviceId: namedTypes.Identifier
) {
  const toOneFile = await readFile(toOneTemplatePath);
  const { relatedEntity } = field.properties;
  const relatedEntityDTOs = dtos[relatedEntity.name];

  interpolate(toOneFile, {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    GET_PROPERTY: createFieldFindOneFunctionId(field.name),
    FIND_ONE: builders.identifier(camelCase(field.name)),
    ARGS: relatedEntityDTOs.findOneArgs.id,
  });

  return getMethods(getClassDeclarationById(toOneFile, MIXIN_ID));
}

async function createToManyRelationMethods(
  field: EntityLookupField,
  entityDTO: NamedClassDeclaration,
  entityType: string,
  dtos: DTOs,
  serviceId: namedTypes.Identifier
) {
  const toManyFile = await readFile(toManyTemplatePath);
  const { relatedEntity } = field.properties;
  const relatedEntityDTOs = dtos[relatedEntity.name];

  interpolate(toManyFile, {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    FIND_PROPERTY: createFieldFindManyFunctionId(field.name),
    FIND_MANY: builders.identifier(camelCase(field.name)),
    ARGS: relatedEntityDTOs.findManyArgs.id,
  });

  return getMethods(getClassDeclarationById(toManyFile, MIXIN_ID));
}
