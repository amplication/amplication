import { EnumEntityAction } from "../../../models";
import {
  print,
  readFile,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
  removeImportsTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import pluginWrapper from "../../../plugin-wrapper";
import {
  Entity,
  EntityLookupField,
  Module,
  NamedClassDeclaration,
  CreateEntityResolverParams,
  CreateEntityResolverBaseParams,
  DTOs,
  EventNames,
  CreateEntityResolverToManyRelationMethodsParams,
  CreateEntityResolverToOneRelationMethodsParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../utils/module";

import { setEndpointPermissions } from "../../../utils/set-endpoint-permission";
import {
  interpolate,
  importNames,
  addAutoGenerationComment,
  addImports,
  getClassDeclarationById,
  importContainedIdentifiers,
  getMethods,
  deleteClassMemberByKey,
  memberExpression,
} from "../../../utils/ast";
import {
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../utils/field";
import { getDTONameToPath } from "../create-dtos";
import { getImportableDTOs } from "../dto/create-dto-module";
import {
  createServiceId,
  createFieldFindManyFunctionId,
  createFieldFindOneFunctionId,
} from "../service/create-service";
import { createDataMapping } from "../controller/create-data-mapping";
import { IMPORTABLE_IDENTIFIERS_NAMES } from "../../../utils/identifiers-imports";
import DsgContext from "../../../dsg-context";
import { MethodsIdsActionEntityTriplet } from "../controller/create-controller";

const MIXIN_ID = builders.identifier("Mixin");
const DATA_MEMBER_EXPRESSION = memberExpression`args.data`;
const resolverTemplatePath = require.resolve("./resolver.template.ts");
const resolverTemplateBasePath = require.resolve("./resolver.base.template.ts");
const toOneTemplatePath = require.resolve("./to-one.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createResolverModules(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity
): Promise<ModuleMap> {
  const serviceId = createServiceId(entityType);
  const resolverId = createResolverId(entityType);
  const resolverBaseId = createResolverBaseId(entityType);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DTOs } = DsgContext.getInstance;
  const entityDTOs = DTOs[entity.name];
  const {
    entity: entityDTO,
    createArgs,
    updateArgs,
    deleteArgs,
    findManyArgs,
    countArgs,
    findOneArgs,
  } = entityDTOs;
  const createMutationId = builders.identifier(`create${entityType}`);
  const updateMutationId = builders.identifier(`update${entityType}`);
  const deleteMutationId = builders.identifier(`delete${entityType}`);
  const entityQueryId = builders.identifier(camelCase(entityType));
  const entitiesQueryId = builders.identifier(entity.pluralName);
  const metaQueryId = builders.identifier(`_${entity.pluralName}Meta`);

  const template = await readFile(resolverTemplatePath);
  const templateBase = await readFile(resolverTemplateBasePath);

  const templateMapping = {
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
    COUNT_ARGS: countArgs.id,
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

  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.mergeMany([
    await pluginWrapper(createResolverModule, EventNames.CreateEntityResolver, {
      template,
      entityName,
      entityServiceModule,
      serviceId,
      resolverBaseId,
      templateMapping,
    }),
    await pluginWrapper(
      createResolverBaseModule,
      EventNames.CreateEntityResolverBase,
      {
        template: templateBase,
        entityName,
        entityType,
        entityServiceModule,
        entity,
        entityDTO,
        serviceId,
        resolverBaseId,
        createArgs,
        updateArgs,
        createMutationId,
        updateMutationId,
        templateMapping,
      }
    ),
  ]);

  return moduleMap;
}

async function createResolverModule({
  template,
  entityName,
  entityServiceModule,
  serviceId,
  resolverBaseId,
  templateMapping,
}: CreateEntityResolverParams): Promise<ModuleMap> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { serverDirectories, DTOs } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/${entityName}.resolver.ts`;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.resolver.base.ts`;

  interpolate(template, templateMapping);

  addImports(template, [
    importNames(
      [resolverBaseId],
      relativeImportPath(modulePath, moduleBasePath)
    ),
  ]);

  const dtoNameToPath = getDTONameToPath(DTOs);
  const dtoImports = importContainedIdentifiers(
    template,
    getImportableDTOs(modulePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    template,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(template, [...identifiersImports, ...dtoImports]);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  addImports(template, [serviceImport]);
  removeTSIgnoreComments(template);
  removeImportsTSIgnoreComments(template);
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

async function createResolverBaseModule({
  template,
  entityName,
  entityType,
  entityServiceModule,
  entity,
  serviceId,
  resolverBaseId,
  createArgs,
  updateArgs,
  createMutationId,
  updateMutationId,
  templateMapping,
}: CreateEntityResolverBaseParams): Promise<ModuleMap> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { serverDirectories, DTOs } = DsgContext.getInstance;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.resolver.base.ts`;
  const entityDTOs = DTOs[entity.name];
  const { entity: entityDTO } = entityDTOs;
  interpolate(template, templateMapping);

  const classDeclaration = getClassDeclarationById(template, resolverBaseId);
  const toManyRelationFields = entity.fields.filter(isToManyRelationField);
  const toManyRelationMethods = (
    await Promise.all(
      toManyRelationFields.map((field) =>
        createToManyRelationMethods(
          field,
          entityDTO,
          entityType,
          DTOs,
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
          DTOs,
          serviceId
        )
      )
    )
  ).flat();

  const methodsIdsActionPairs: MethodsIdsActionEntityTriplet[] = [
    {
      methodId: templateMapping["CREATE_MUTATION"] as namedTypes.Identifier,
      action: EnumEntityAction.Create,
      entity: entity,
    },
    {
      methodId: templateMapping["ENTITIES_QUERY"] as namedTypes.Identifier,
      action: EnumEntityAction.Search,
      entity: entity,
    },
    {
      methodId: templateMapping["META_QUERY"] as namedTypes.Identifier,
      action: EnumEntityAction.Search,
      entity: entity,
    },
    {
      methodId: templateMapping["ENTITY_QUERY"] as namedTypes.Identifier,
      action: EnumEntityAction.View,
      entity: entity,
    },
    {
      methodId: templateMapping["UPDATE_MUTATION"] as namedTypes.Identifier,
      action: EnumEntityAction.Update,
      entity: entity,
    },
    {
      methodId: templateMapping["DELETE_MUTATION"] as namedTypes.Identifier,
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

  const dtoNameToPath = getDTONameToPath(DTOs);
  const dtoImports = importContainedIdentifiers(
    template,
    getImportableDTOs(moduleBasePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    template,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(template, [...identifiersImports, ...dtoImports]);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(moduleBasePath, entityServiceModule)
  );

  addImports(template, [serviceImport]);
  removeTSIgnoreComments(template);
  removeImportsTSIgnoreComments(template);
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
  const findOneMethodName = `resolveField${pascalCase(field.name)}`;

  const toOneMapping = {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    GET_PROPERTY: createFieldFindOneFunctionId(field.name),
    FIND_ONE: builders.identifier(findOneMethodName),
    FIND_ONE_FIELD_NAME: builders.stringLiteral(camelCase(field.name)),
    ARGS: relatedEntityDTOs.findOneArgs.id,
  };

  const eventParams: CreateEntityResolverToOneRelationMethodsParams = {
    field: field,
    entityType: entityType,
    serviceId: serviceId,
    methods: [],
    toOneFile: toOneFile,
    toOneMapping: toOneMapping,
  };

  await pluginWrapper(
    createToOneRelationMethodsInternal,
    EventNames.CreateEntityResolverToOneRelationMethods,
    eventParams
  );

  return eventParams.methods;
}

async function createToOneRelationMethodsInternal(
  eventParams: CreateEntityResolverToOneRelationMethodsParams
): Promise<ModuleMap> {
  interpolate(eventParams.toOneFile, eventParams.toOneMapping);

  const classDeclaration = getClassDeclarationById(
    eventParams.toOneFile,
    MIXIN_ID
  );
  const { relatedEntity } = eventParams.field.properties;

  setEndpointPermissions(
    classDeclaration,
    eventParams.toOneMapping["FIND_ONE"] as namedTypes.Identifier,
    EnumEntityAction.View,
    relatedEntity
  );

  eventParams.methods = getMethods(classDeclaration);
  return new ModuleMap(DsgContext.getInstance.logger);
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
  const findManyMethodName = `resolveField${pascalCase(field.name)}`;

  const toManyMapping = {
    SERVICE: serviceId,
    ENTITY: entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    RELATED_ENTITY_NAME: builders.stringLiteral(relatedEntity.name),
    FIND_PROPERTY: createFieldFindManyFunctionId(field.name),
    FIND_MANY: builders.identifier(findManyMethodName),
    FIND_MANY_FIELD_NAME: builders.stringLiteral(camelCase(field.name)),
    ARGS: relatedEntityDTOs.findManyArgs.id,
  };

  const eventParams: CreateEntityResolverToManyRelationMethodsParams = {
    field: field,
    entityType: entityType,
    serviceId: serviceId,
    methods: [],
    toManyFile: toManyFile,
    toManyMapping: toManyMapping,
  };

  await pluginWrapper(
    createToManyRelationMethodsInternal,
    EventNames.CreateEntityResolverToManyRelationMethods,
    eventParams
  );

  return eventParams.methods;
}

async function createToManyRelationMethodsInternal(
  eventParams: CreateEntityResolverToManyRelationMethodsParams
): Promise<ModuleMap> {
  interpolate(eventParams.toManyFile, eventParams.toManyMapping);
  const { relatedEntity } = eventParams.field.properties;
  const classDeclaration = getClassDeclarationById(
    eventParams.toManyFile,
    MIXIN_ID
  );

  setEndpointPermissions(
    classDeclaration,
    eventParams.toManyMapping["FIND_MANY"] as namedTypes.Identifier,
    EnumEntityAction.Search,
    relatedEntity
  );

  eventParams.methods = getMethods(classDeclaration);
  return new ModuleMap(DsgContext.getInstance.logger);
}
