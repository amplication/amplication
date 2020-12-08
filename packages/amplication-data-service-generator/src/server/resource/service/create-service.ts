import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module, Entity, EnumDataType, EntityField } from "../../../types";
import { readFile, relativeImportPath } from "../../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  addImports,
  importNames,
  findClassDeclarationById,
  removeESLintComments,
  memberExpression,
  callExpression,
  classMethod,
} from "../../../util/ast";
import { addInjectableDependency } from "../../../util/nestjs-code-generation";
import { SRC_DIRECTORY } from "../../constants";

Error.stackTraceLimit = Infinity;

const ARGS_ID = builders.identifier("args");
const DATA_ID = builders.identifier("data");
const PASSWORD_SERVICE_ID = builders.identifier("PasswordService");
const PASSWORD_SERVICE_MEMBER_ID = builders.identifier("passwordService");
const PASSWORD_SERVICE_MODULE_PATH = "auth/password.service.ts";
const STRING_FIELD_UPDATE_OPERATIONS_INPUT_ID = builders.identifier(
  "StringFieldUpdateOperationsInput"
);
const PRISMA_CLIENT_MODULE = "@prisma/client";
const HASH_MEMBER_EXPRESSION = memberExpression`this.${PASSWORD_SERVICE_MEMBER_ID}.hash`;

const serviceTemplatePath = require.resolve("./service.template.ts");

export async function createServiceModule(
  entityName: string,
  entityType: string,
  entity: Entity
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.service.ts`;
  const file = await readFile(serviceTemplatePath);
  const serviceId = createServiceId(entityType);
  const passwordFields = entity.fields.filter(
    (field) => field.dataType === EnumDataType.Password
  );

  interpolate(file, {
    SERVICE: serviceId,
    ENTITY: builders.identifier(entityType),
    CREATE_ARGS: builders.identifier(`${entityType}CreateArgs`),
    FIND_MANY_ARGS: builders.identifier(`FindMany${entityType}Args`),
    FIND_ONE_ARGS: builders.identifier(`FindOne${entityType}Args`),
    UPDATE_ARGS: builders.identifier(`${entityType}UpdateArgs`),
    DELETE_ARGS: builders.identifier(`${entityType}DeleteArgs`),
    DELEGATE: builders.identifier(entityName),
    CREATE_ARGS_MAPPING: createDataMapping(
      passwordFields.map((field) => {
        const fieldId = builders.identifier(field.name);
        return builders.objectProperty(
          fieldId,
          builders.awaitExpression(
            callExpression`${HASH_MEMBER_EXPRESSION}(${ARGS_ID}.${DATA_ID}.${fieldId})`
          )
        );
      })
    ),
    UPDATE_ARGS_MAPPING: createDataMapping(
      passwordFields.map((field) => {
        const fieldId = builders.identifier(field.name);
        return builders.objectProperty(
          fieldId,
          builders.awaitExpression(
            callExpression`this.hashPasswordInput(${ARGS_ID}.${DATA_ID}.${fieldId})`
          )
        );
      })
    ),
  });

  if (passwordFields.length) {
    const classDeclaration = findClassDeclarationById(file, serviceId);
    if (!classDeclaration) {
      throw new Error(`Could not find ${serviceId.name}`);
    }

    addImports(file, [
      importNames(
        [PASSWORD_SERVICE_ID],
        relativeImportPath(modulePath, PASSWORD_SERVICE_MODULE_PATH)
      ),
      importNames(
        [STRING_FIELD_UPDATE_OPERATIONS_INPUT_ID],
        PRISMA_CLIENT_MODULE
      ),
    ]);

    addInjectableDependency(
      classDeclaration,
      PASSWORD_SERVICE_MEMBER_ID.name,
      PASSWORD_SERVICE_ID
    );

    classDeclaration.body.body
      .push(classMethod`private async hashPasswordInput<T extends undefined | string | ${STRING_FIELD_UPDATE_OPERATIONS_INPUT_ID}>(
    password: T
  ): Promise<T> {
    if (typeof password === "string") {
      return await ${HASH_MEMBER_EXPRESSION}(password) as T
    } else if (typeof password?.set === "string") {
      return {set: await ${HASH_MEMBER_EXPRESSION}(password.set)} as T
    } else {
      return password;
    }
  }`);
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

function createDataMapping(
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
