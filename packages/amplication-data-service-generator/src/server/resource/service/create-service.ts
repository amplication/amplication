import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module, Entity, EnumDataType } from "../../../types";
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
  const delegateId = builders.identifier(entityName);
  const findManyArgsId = builders.identifier(`FindMany${entityType}Args`);
  const findOneArgsId = builders.identifier(`FindOne${entityType}Args`);

  interpolate(file, {
    SERVICE: serviceId,
    ENTITY: builders.identifier(entityType),
    CREATE_ARGS: builders.identifier(`${entityType}CreateArgs`),
    UPDATE_ARGS: builders.identifier(`${entityType}UpdateArgs`),
    DELETE_ARGS: builders.identifier(`${entityType}DeleteArgs`),
    DELEGATE: delegateId,
    CREATE_ARGS_MAPPING: createMutationDataMapping(
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
    UPDATE_ARGS_MAPPING: createMutationDataMapping(
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

  const classDeclaration = findClassDeclarationById(file, serviceId);

  if (!classDeclaration) {
    throw new Error(`Could not find ${serviceId.name}`);
  }

  addImports(file, [
    importNames([findManyArgsId, findOneArgsId], PRISMA_CLIENT_MODULE),
  ]);

  if (!passwordFields.length) {
    classDeclaration.body.body.push(
      classMethod`async findMany<T extends ${findManyArgsId}>(args: Subset<T, ${findManyArgsId}>) {
        return this.prisma.${delegateId}.findMany(args);
      }`,
      classMethod`async findOne<T extends ${findOneArgsId}>(args: Subset<T, ${findOneArgsId}>) {
        return this.prisma.${delegateId}.findOne(args);
      }`
    );
  } else {
    classDeclaration.body.body.push(
      classMethod`async findMany<T extends ${findManyArgsId}>(args: Subset<T, ${findManyArgsId}>) {
        const data = await this.prisma.${delegateId}.findMany(args);
        return data.map(item => ({
          ...item,
          ${passwordFields
            .map(
              (field) => `${field.name}: this.hashPassword(item.${field.name})`
            )
            .join(",\n")}
        }))
      }`,
      classMethod`async findOne<T extends ${findOneArgsId}>(args: Subset<T, ${findOneArgsId}>) {
        const data = await this.prisma.${delegateId}.findOne(args);
        if (!data) {
          return data;
        }
        return {
          ...data,
          ${passwordFields
            .map(
              (field) => `${field.name}: this.hashPassword(data.${field.name})`
            )
            .join(",\n")}
        }
      }`
    );

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
        if (typeof password === "object" && typeof password?.set === "string") {
          return {set: await ${HASH_MEMBER_EXPRESSION}(password.set)} as T
        }
        if (typeof password === "object") {
          if (typeof password.set === "string") {
            return { set: await this.passwordService.hash(password.set) } as T;
          }
          return password;
        }
        if (typeof password === "string") {
          return (await this.passwordService.hash(password)) as T;
        }
        return password;
      }`);
    classDeclaration.body.body
      .push(classMethod`private async hashPassword<T extends undefined | string>(password: T): Promise<T> {
        if (typeof password === "string") {
          return await ${HASH_MEMBER_EXPRESSION}(password) as T
        }
        return password;
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
