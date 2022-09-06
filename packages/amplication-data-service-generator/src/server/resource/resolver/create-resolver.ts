import { EnumEntityAction } from "./../../../models";
import { print } from "recast";
import { ASTNode, builders, namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import {
  Entity,
  EntityLookupField,
  Module,
  NamedClassDeclaration,
  DTOs,
} from "@amplication/code-gen-types";
import { readFile, relativeImportPath } from "../../../util/module";
import { setEndpointPermissions } from "../../../util/set-endpoint-permission";
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
  removeImportsTSIgnoreComments,
  getMethods,
  deleteClassMemberByKey,
  memberExpression,
  removeTSIgnoreComments,
} from "../../../util/ast";
import {
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../util/field";
import { getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import {
  createServiceId,
  createFieldFindManyFunctionId,
  createFieldFindOneFunctionId,
} from "../service/create-service";
import { createDataMapping } from "../controller/create-data-mapping";
import { MethodsIdsActionEntityTriplet } from "../controller/create-controller";
import { IMPORTABLE_IDENTIFIERS_NAMES } from "../../../util/identifiers-imports";

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
  dtos: DTOs,
  srcDirectory: string
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
  const entitiesQueryId = builders.identifier(entity.pluralName);
  const metaQueryId = builders.identifier(`_${entity.pluralName}Meta`);

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
      false,
      srcDirectory
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
      true,
      srcDirectory
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
  isBaseClass: boolean,
  srcDirectory: string
): Promise<Module> {
  const modulePath = `${srcDirectory}/${entityName}/${entityName}.resolver.ts`;
  const moduleBasePath = `${srcDirectory}/${entityName}/base/${entityName}.resolver.base.ts`;
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

    const methodsIdsActionPairs: MethodsIdsActionEntityTriplet[] = [
      {
        methodId: mapping["CREATE_MUTATION"] as namedTypes.Identifier,
        action: EnumEntityAction.Create,
        entity: entity,
      },
      {
        methodId: mapping["ENTITIES_QUERY"] as namedTypes.Identifier,
        action: EnumEntityAction.Search,
        entity: entity,
      },
      {
        methodId: mapping["META_QUERY"] as namedTypes.Identifier,
        action: EnumEntityAction.Search,
        entity: entity,
      },
      {
        methodId: mapping["ENTITY_QUERY"] as namedTypes.Identifier,
        action: EnumEntityAction.View,
        entity: entity,
      },
      {
        methodId: mapping["UPDATE_MUTATION"] as namedTypes.Identifier,
        action: EnumEntityAction.Update,
        entity: entity,
      },
      {
        methodId: mapping["DELETE_MUTATION"] as namedTypes.Identifier,
        action: EnumEntityAction.Delete,
        entity: entity,
      },
    ];

    methodsIdsActionPairs.forEach(({ methodId, action, entity }) => {
      setEndpointPermissions(classDeclaration, methodId, action, entity);
    });

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

  const dtoNameToPath = getDTONameToPath(dtos, srcDirectory);
  const dtoImports = importContainedIdentifiers(
    file,
    getImportableDTOs(isBaseClass ? moduleBasePath : modulePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    file,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(file, [...identifiersImports, ...dtoImports]);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(
      isBaseClass ? moduleBasePath : modulePath,
      entityServiceModule
    )
  );

  addImports(file, [serviceImport]);
  removeTSIgnoreComments(file);
  removeImportsTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSClassDeclares(file);
  if (isBaseClass) {
    addAutoGenerationComment(file);
  }

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

  const toOneMapping = {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    GET_PROPERTY: createFieldFindOneFunctionId(field.name),
    FIND_ONE: builders.identifier(camelCase(field.name)),
    ARGS: relatedEntityDTOs.findOneArgs.id,
  };

  interpolate(toOneFile, toOneMapping);

  const classDeclaration = getClassDeclarationById(toOneFile, MIXIN_ID);

  setEndpointPermissions(
    classDeclaration,
    toOneMapping["FIND_ONE"] as namedTypes.Identifier,
    EnumEntityAction.View,
    relatedEntity
  );

  return getMethods(classDeclaration);
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

  const toManyMapping = {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    FIND_PROPERTY: createFieldFindManyFunctionId(field.name),
    FIND_MANY: builders.identifier(camelCase(field.name)),
    ARGS: relatedEntityDTOs.findManyArgs.id,
  };

  interpolate(toManyFile, toManyMapping);

  const classDeclaration = getClassDeclarationById(toManyFile, MIXIN_ID);

  setEndpointPermissions(
    classDeclaration,
    toManyMapping["FIND_MANY"] as namedTypes.Identifier,
    EnumEntityAction.Search,
    relatedEntity
  );

  return getMethods(classDeclaration);
}
