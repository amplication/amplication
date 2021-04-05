import { ASTNode, builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { print } from "recast";
import { Entity, EntityField, EntityLookupField, Module } from "../../../types";
import {
  addIdentifierToConstructorSuperCall,
  addImports,
  awaitExpression,
  extractImportDeclarations,
  getClassDeclarationById,
  getMethods,
  importNames,
  interpolate,
  logicalExpression,
  memberExpression,
  NamedClassDeclaration,
  removeESLintComments,
  removeTSClassDeclares,
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../../util/ast";
import {
  isPasswordField,
  isOneToOneRelationField,
  isToManyRelationField,
} from "../../../util/field";
import { readFile, relativeImportPath } from "../../../util/module";
import { addInjectableDependency } from "../../../util/nestjs-code-generation";
import { SRC_DIRECTORY } from "../../constants";
import { DTOs } from "../create-dtos";

const MIXIN_ID = builders.identifier("Mixin");
const ARGS_ID = builders.identifier("args");
const DATA_ID = builders.identifier("data");
const PASSWORD_SERVICE_ID = builders.identifier("PasswordService");
const PASSWORD_SERVICE_MEMBER_ID = builders.identifier("passwordService");
const PASSWORD_SERVICE_MODULE_PATH = `${SRC_DIRECTORY}/auth/password.service.ts`;
const HASH_MEMBER_EXPRESSION = memberExpression`this.${PASSWORD_SERVICE_MEMBER_ID}.hash`;
const TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID = builders.identifier(
  "transformStringFieldUpdateInput"
);
const PRISMA_UTIL_MODULE_PATH = `${SRC_DIRECTORY}/prisma.util.ts`;
const serviceTemplatePath = require.resolve("./service.template.ts");
const serviceBaseTemplatePath = require.resolve("./service.base.template.ts");
const PASSWORD_FIELD_ASYNC_METHODS = new Set(["create", "update"]);
const toOneTemplatePath = require.resolve("./to-one.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

export async function createServiceModules(
  entityName: string,
  entityType: string,
  entity: Entity,
  dtos: DTOs
): Promise<Module[]> {
  const serviceId = createServiceId(entityType);
  const serviceBaseId = createServiceBaseId(entityType);
  const delegateId = builders.identifier(entityName);
  const passwordFields = entity.fields.filter(isPasswordField);
  const entityDTOs = dtos[entity.name];
  const { entity: entityDTO } = entityDTOs;

  const mapping = {
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
  return [
    await createServiceModule(
      entityName,
      mapping,
      passwordFields,
      serviceId,
      serviceBaseId
    ),
    await createServiceBaseModule(
      entityName,
      entity,
      entityDTO,
      mapping,
      passwordFields,
      serviceId,
      serviceBaseId,
      dtos,
      delegateId
    ),
  ];
}

async function createServiceModule(
  entityName: string,
  mapping: { [key: string]: ASTNode | undefined },
  passwordFields: EntityField[],
  serviceId: namedTypes.Identifier,
  serviceBaseId: namedTypes.Identifier
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.service.ts`;
  const moduleBasePath = `${SRC_DIRECTORY}/${entityName}/base/${entityName}.service.base.ts`;
  const file = await readFile(serviceTemplatePath);

  interpolate(file, mapping);
  removeTSClassDeclares(file);

  //add import to base class
  addImports(file, [
    importNames(
      [serviceBaseId],
      relativeImportPath(modulePath, moduleBasePath)
    ),
  ]);

  //if there are any password fields, add imports, injection, and pass service to super
  if (passwordFields.length) {
    const classDeclaration = getClassDeclarationById(file, serviceId);

    addInjectableDependency(
      classDeclaration,
      PASSWORD_SERVICE_MEMBER_ID.name,
      PASSWORD_SERVICE_ID,
      "protected"
    );

    addIdentifierToConstructorSuperCall(file, PASSWORD_SERVICE_MEMBER_ID);

    for (const member of classDeclaration.body.body) {
      if (
        namedTypes.ClassMethod.check(member) &&
        namedTypes.Identifier.check(member.key) &&
        PASSWORD_FIELD_ASYNC_METHODS.has(member.key.name)
      ) {
        member.async = true;
      }
    }
    //add the password service
    addImports(file, [
      importNames(
        [PASSWORD_SERVICE_ID],
        relativeImportPath(modulePath, PASSWORD_SERVICE_MODULE_PATH)
      ),
    ]);
  }

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

async function createServiceBaseModule(
  entityName: string,
  entity: Entity,
  entityDTO: NamedClassDeclaration,
  mapping: { [key: string]: ASTNode | undefined },
  passwordFields: EntityField[],
  serviceId: namedTypes.Identifier,
  serviceBaseId: namedTypes.Identifier,
  dtos: DTOs,
  delegateId: namedTypes.Identifier
): Promise<Module> {
  const moduleBasePath = `${SRC_DIRECTORY}/${entityName}/base/${entityName}.service.base.ts`;
  const file = await readFile(serviceBaseTemplatePath);

  interpolate(file, mapping);

  const classDeclaration = getClassDeclarationById(file, serviceBaseId);
  const toManyRelationFields = entity.fields.filter(isToManyRelationField);
  const toManyRelations = (
    await Promise.all(
      toManyRelationFields.map(async (field) => {
        const toManyFile = await createToManyRelationFile(
          field,
          entityDTO,
          dtos,
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
        const toOneFile = await createToOneRelationFile(field, delegateId);

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
    file,
    toManyRelations.flatMap((relation) => relation.imports)
  );
  addImports(
    file,
    toOneRelations.flatMap((relation) => relation.imports)
  );

  removeTSClassDeclares(file);

  if (passwordFields.length) {
    const classDeclaration = getClassDeclarationById(file, serviceBaseId);

    addInjectableDependency(
      classDeclaration,
      PASSWORD_SERVICE_MEMBER_ID.name,
      PASSWORD_SERVICE_ID,
      "protected"
    );

    for (const member of classDeclaration.body.body) {
      if (
        namedTypes.ClassMethod.check(member) &&
        namedTypes.Identifier.check(member.key) &&
        PASSWORD_FIELD_ASYNC_METHODS.has(member.key.name)
      ) {
        member.async = true;
      }
    }
    //add the password service
    addImports(file, [
      importNames(
        [PASSWORD_SERVICE_ID],
        relativeImportPath(moduleBasePath, PASSWORD_SERVICE_MODULE_PATH)
      ),
    ]);

    addImports(file, [
      importNames(
        [TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID],
        relativeImportPath(moduleBasePath, PRISMA_UTIL_MODULE_PATH)
      ),
    ]);
  }

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: moduleBasePath,
    code: print(file).code,
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
  field: EntityLookupField,
  delegateId: namedTypes.Identifier
) {
  const toOneFile = await readFile(toOneTemplatePath);
  const { relatedEntity } = field.properties;

  interpolate(toOneFile, {
    DELEGATE: delegateId,
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    PROPERTY: builders.identifier(field.name),
    FIND_ONE: createFieldFindOneFunctionId(field.name),
  });

  return toOneFile;
}

async function createToManyRelationFile(
  field: EntityLookupField,
  entityDTO: NamedClassDeclaration,
  dtos: DTOs,
  delegateId: namedTypes.Identifier
) {
  const toManyFile = await readFile(toManyTemplatePath);
  const { relatedEntity } = field.properties;
  const relatedEntityDTOs = dtos[relatedEntity.name];

  interpolate(toManyFile, {
    DELEGATE: delegateId,
    RELATED_ENTITY: builders.identifier(relatedEntity.name),
    PROPERTY: builders.identifier(field.name),
    FIND_MANY: createFieldFindManyFunctionId(field.name),
    ARGS: relatedEntityDTOs.findManyArgs.id,
  });

  return toManyFile;
}
