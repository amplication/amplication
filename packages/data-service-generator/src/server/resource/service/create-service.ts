import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import {
  print,
  readFile,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import {
  Entity,
  EntityLookupField,
  Module,
  EventNames,
  CreateEntityServiceParams,
  CreateEntityServiceBaseParams,
  types,
  ModuleMap,
} from "@amplication/code-gen-types";
import {
  addAutoGenerationComment,
  addImports,
  extractImportDeclarations,
  getClassDeclarationById,
  getMethods,
  importNames,
  interpolate,
} from "../../../utils/ast";
import {
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../utils/field";
import { relativeImportPath } from "../../../utils/module";
import pluginWrapper from "../../../plugin-wrapper";
import DsgContext from "../../../dsg-context";
import { getEntityIdType } from "../../../utils/get-entity-id-type";

const MIXIN_ID = builders.identifier("Mixin");
const ARGS_ID = builders.identifier("args");
const serviceTemplatePath = require.resolve("./service.template.ts");
const serviceBaseTemplatePath = require.resolve("./service.base.template.ts");
const toOneTemplatePath = require.resolve("./to-one.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createServiceModules(
  entityName: string,
  entityType: string,
  entity: Entity,
  serviceId: namedTypes.Identifier,
  serviceBaseId: namedTypes.Identifier,
  delegateId: namedTypes.Identifier
): Promise<ModuleMap> {
  const template = await readFile(serviceTemplatePath);
  const templateBase = await readFile(serviceBaseTemplatePath);

  const templateMapping = createTemplateMapping(
    entityType,
    serviceId,
    serviceBaseId,
    delegateId
  );

  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  await moduleMap.mergeMany([
    await pluginWrapper(createServiceModule, EventNames.CreateEntityService, {
      entityName,
      templateMapping,
      serviceId,
      serviceBaseId,
      template,
    }),
    await pluginWrapper(
      createServiceBaseModule,
      EventNames.CreateEntityServiceBase,
      {
        entityName,
        entity,
        templateMapping,
        serviceId,
        serviceBaseId,
        delegateId,
        template: templateBase,
      }
    ),
  ]);

  return moduleMap;
}

async function createServiceModule({
  entityName,
  templateMapping,
  serviceId,
  serviceBaseId,
  template,
}: CreateEntityServiceParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/${entityName}.service.ts`;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.service.base.ts`;

  interpolate(template, templateMapping);
  removeTSClassDeclares(template);

  //add import to base class
  addImports(template, [
    importNames(
      [serviceBaseId],
      relativeImportPath(modulePath, moduleBasePath)
    ),
  ]);

  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);
  removeTSInterfaceDeclares(template);

  const module: Module = {
    path: modulePath,
    code: print(template).code,
  };
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.set(module);
  return moduleMap;
}

async function createServiceBaseModule({
  entityName,
  entity,
  templateMapping,
  serviceId,
  serviceBaseId,
  delegateId,
  template,
}: CreateEntityServiceBaseParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;

  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.service.base.ts`;

  interpolate(template, templateMapping);

  const classDeclaration = getClassDeclarationById(template, serviceBaseId);
  const toManyRelationFields = entity.fields.filter(isToManyRelationField);
  const toManyRelations = (
    await Promise.all(
      toManyRelationFields.map(async (field) => {
        const toManyFile = await createToManyRelationFile(
          entity,
          field,
          delegateId
        );

        const imports = extractImportDeclarations(toManyFile);
        const methods = getMethods(
          getClassDeclarationById(toManyFile, MIXIN_ID)
        );
        return {
          methods,
          imports,
        };
      })
    )
  ).flat();

  const toOneRelationFields = entity.fields.filter(isOneToOneRelationField);
  const toOneRelations = (
    await Promise.all(
      toOneRelationFields.map(async (field) => {
        const toOneFile = await createToOneRelationFile(
          entity,
          field,
          delegateId
        );

        const imports = extractImportDeclarations(toOneFile);
        const methods = getMethods(
          getClassDeclarationById(toOneFile, MIXIN_ID)
        );
        return {
          methods,
          imports,
        };
      })
    )
  ).flat();

  classDeclaration.body.body.push(
    ...toManyRelations.flatMap((relation) => relation.methods),
    ...toOneRelations.flatMap((relation) => relation.methods)
    //...
  );

  addImports(
    template,
    toManyRelations.flatMap((relation) => relation.imports)
  );
  addImports(
    template,
    toOneRelations.flatMap((relation) => relation.imports)
  );

  removeTSClassDeclares(template);
  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);
  removeTSInterfaceDeclares(template);
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

export function createServiceId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Service`);
}

export function createServiceBaseId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}ServiceBase`);
}

export function createFieldFindManyFunctionId(
  fieldName: string
): namedTypes.Identifier {
  return builders.identifier(`find${pascalCase(fieldName)}`);
}

export function createFieldFindOneFunctionId(
  fieldName: string
): namedTypes.Identifier {
  return builders.identifier(`get${pascalCase(fieldName)}`);
}

async function createToOneRelationFile(
  entity: Entity,
  field: EntityLookupField,
  delegateId: namedTypes.Identifier
) {
  const toOneFile = await readFile(toOneTemplatePath);
  const { relatedEntity } = field.properties;

  interpolate(toOneFile, {
    DELEGATE: delegateId,
    PARENT_ID_TYPE: getParentIdType(entity.name),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    PROPERTY: builders.identifier(field.name),
    FIND_ONE: createFieldFindOneFunctionId(field.name),
  });

  return toOneFile;
}

async function createToManyRelationFile(
  entity: Entity,
  field: EntityLookupField,
  delegateId: namedTypes.Identifier
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DTOs } = DsgContext.getInstance;
  const toManyFile = await readFile(toManyTemplatePath);
  const { relatedEntity } = field.properties;
  const relatedEntityDTOs = DTOs[relatedEntity.name];

  interpolate(toManyFile, {
    DELEGATE: delegateId,
    PARENT_ID_TYPE: getParentIdType(entity.name),
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    PROPERTY: builders.identifier(field.name),
    FIND_MANY: createFieldFindManyFunctionId(field.name),
    ARGS: relatedEntityDTOs.findManyArgs.id,
  });

  return toManyFile;
}

function getParentIdType(entityName: string): namedTypes.Identifier {
  const idType = getEntityIdType(entityName);

  const idTypeOptions: {
    [key in types.Id["idType"]]: namedTypes.Identifier;
  } = {
    AUTO_INCREMENT: builders.identifier("number"),
    AUTO_INCREMENT_BIG_INT: builders.identifier("number"),
    UUID: builders.identifier("string"),
    CUID: builders.identifier("string"),
  };

  return idTypeOptions[idType];
}

function createTemplateMapping(
  entityType: string,
  serviceId: namedTypes.Identifier,
  serviceBaseId: namedTypes.Identifier,
  delegateId: namedTypes.Identifier
): { [key: string]: any } {
  return {
    SERVICE: serviceId,
    SERVICE_BASE: serviceBaseId,
    ENTITY: builders.identifier(entityType),
    COUNT_ARGS: builders.identifier(`${entityType}CountArgs`),
    FIND_MANY_ARGS: builders.identifier(`${entityType}FindManyArgs`),
    FIND_ONE_ARGS: builders.identifier(`${entityType}FindUniqueArgs`),
    CREATE_ARGS: builders.identifier(`${entityType}CreateArgs`),
    UPDATE_ARGS: builders.identifier(`${entityType}UpdateArgs`),
    DELETE_ARGS: builders.identifier(`${entityType}DeleteArgs`),
    DELEGATE: delegateId,
    CREATE_ARGS_MAPPING: ARGS_ID,
    UPDATE_ARGS_MAPPING: ARGS_ID,
  };
}
