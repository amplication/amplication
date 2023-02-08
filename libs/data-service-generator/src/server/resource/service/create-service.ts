import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { print, readFile } from "@amplication/code-gen-utils";
import {
  Entity,
  EntityLookupField,
  Module,
  EventNames,
  CreateEntityServiceParams,
  CreateEntityServiceBaseParams,
  types,
  EntityField,
} from "@amplication/code-gen-types";
import {
  addAutoGenerationComment,
  addImports,
  awaitExpression,
  extractImportDeclarations,
  getClassDeclarationById,
  getMethods,
  importNames,
  interpolate,
  logicalExpression,
  memberExpression,
  removeESLintComments,
  removeTSClassDeclares,
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../../util/ast";
import {
  isOneToOneRelationField,
  isPasswordField,
  isToManyRelationField,
} from "../../../util/field";
import { relativeImportPath } from "../../../util/module";
import pluginWrapper from "../../../plugin-wrapper";
import DsgContext from "../../../dsg-context";
import { getEntityIdType } from "../../../util/get-entity-id-type";

const MIXIN_ID = builders.identifier("Mixin");
const ARGS_ID = builders.identifier("args");
const DATA_ID = builders.identifier("data");
const PASSWORD_SERVICE_MEMBER_ID = builders.identifier("passwordService");
const HASH_MEMBER_EXPRESSION = memberExpression`this.${PASSWORD_SERVICE_MEMBER_ID}.hash`;
const TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID = builders.identifier(
  "transformStringFieldUpdateInput"
);
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
): Promise<Module[]> {
  const template = await readFile(serviceTemplatePath);
  const templateBase = await readFile(serviceBaseTemplatePath);
  const passwordFields = entity.fields.filter(isPasswordField);

  const templateMapping = createTemplateMapping(
    entityType,
    serviceId,
    serviceBaseId,
    delegateId,
    passwordFields
  );

  return [
    ...(await pluginWrapper(
      createServiceModule,
      EventNames.CreateEntityService,
      {
        entityName,
        templateMapping,
        serviceId,
        serviceBaseId,
        template,
      }
    )),

    ...(await pluginWrapper(
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
    )),
  ];
}

async function createServiceModule({
  entityName,
  templateMapping,
  serviceId,
  serviceBaseId,
  template,
}: CreateEntityServiceParams): Promise<Module[]> {
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

  return [
    {
      path: modulePath,
      code: print(template).code,
    },
  ];
}

async function createServiceBaseModule({
  entityName,
  entity,
  templateMapping,
  serviceId,
  serviceBaseId,
  delegateId,
  template,
}: CreateEntityServiceBaseParams): Promise<Module[]> {
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

  return [
    {
      path: moduleBasePath,
      code: print(template).code,
    },
  ];
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
    UUID: builders.identifier("string"),
    CUID: builders.identifier("string"),
  };

  return idTypeOptions[idType];
}

function createTemplateMapping(
  entityType: string,
  serviceId: namedTypes.Identifier,
  serviceBaseId: namedTypes.Identifier,
  delegateId: namedTypes.Identifier,
  passwordFields: EntityField[]
): { [key: string]: any } {
  return {
    SERVICE: serviceId,
    SERVICE_BASE: serviceBaseId,
    ENTITY: builders.identifier(entityType),
    FIND_MANY_ARGS: builders.identifier(`${entityType}FindManyArgs`),
    FIND_ONE_ARGS: builders.identifier(`${entityType}FindUniqueArgs`),
    CREATE_ARGS: builders.identifier(`${entityType}CreateArgs`),
    UPDATE_ARGS: builders.identifier(`${entityType}UpdateArgs`),
    DELETE_ARGS: builders.identifier(`${entityType}DeleteArgs`),
    DELEGATE: delegateId,
    CREATE_ARGS_MAPPING: createMutationDataMapping(
      passwordFields.map((field) => {
        const fieldId = builders.identifier(field.name);
        return builders.objectProperty(
          fieldId,
          awaitExpression`await ${HASH_MEMBER_EXPRESSION}(${ARGS_ID}.${DATA_ID}.${fieldId})`
        );
      })
    ),
    UPDATE_ARGS_MAPPING: createMutationDataMapping(
      passwordFields.map((field) => {
        const fieldId = builders.identifier(field.name);
        const valueMemberExpression = memberExpression`${ARGS_ID}.${DATA_ID}.${fieldId}`;
        return builders.objectProperty(
          fieldId,
          logicalExpression`${valueMemberExpression} && await ${TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID}(
            ${ARGS_ID}.${DATA_ID}.${fieldId},
            (password) => ${HASH_MEMBER_EXPRESSION}(password)
          )`
        );
      })
    ),
  };
}
function createMutationDataMapping(
  mappings: namedTypes.ObjectProperty[]
): namedTypes.Identifier | namedTypes.ObjectExpression {
  if (!mappings.length) {
    return ARGS_ID;
  }
  return builders.objectExpression([
    builders.spreadProperty(ARGS_ID),
    builders.objectProperty(
      DATA_ID,
      builders.objectExpression([
        builders.spreadProperty(memberExpression`${ARGS_ID}.${DATA_ID}`),
        ...mappings,
      ])
    ),
  ]);
}
