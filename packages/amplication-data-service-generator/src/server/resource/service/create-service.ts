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
} from "../../../util/ast";
import { addInjectableDependency } from "../../../util/nestjs-code-generation";
import { SRC_DIRECTORY } from "../../constants";

Error.stackTraceLimit = Infinity;

const ARGS_ID = builders.identifier("args");
const DATA_ID = builders.identifier("data");
const PASSWORD_SERVICE_ID = builders.identifier("PasswordService");
const PASSWORD_SERVICE_MEMBER_ID = builders.identifier("passwordService");
const PASSWORD_SERVICE_MODULE_PATH = "auth/password.service.ts";
const HASH_MEMBER_EXPRESSION = memberExpression`this.${PASSWORD_SERVICE_MEMBER_ID}.hash`;
const TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID = builders.identifier(
  "transformStringFieldUpdateInput"
);
const PRISMA_UTIL_MODULE_PATH = `${SRC_DIRECTORY}/prisma.util.ts`;

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

  interpolate(file, {
    SERVICE: serviceId,
    ENTITY: builders.identifier(entityType),
    FIND_MANY_ARGS: builders.identifier(`FindMany${entityType}Args`),
    FIND_ONE_ARGS: builders.identifier(`FindOne${entityType}Args`),
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
        const valueMemberExpression = memberExpression`${ARGS_ID}.${DATA_ID}.${fieldId}`;
        return builders.objectProperty(
          fieldId,
          builders.logicalExpression(
            "&&",
            valueMemberExpression,
            builders.awaitExpression(
              callExpression`${TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID}(
              ${ARGS_ID}.${DATA_ID}.${fieldId},
              (password) => ${HASH_MEMBER_EXPRESSION}(password)
            )`
            )
          )
        );
      })
    ),
  });

  const classDeclaration = findClassDeclarationById(file, serviceId);

  if (!classDeclaration) {
    throw new Error(`Could not find ${serviceId.name}`);
  }

  if (passwordFields.length) {
    addImports(file, [
      importNames(
        [PASSWORD_SERVICE_ID],
        relativeImportPath(modulePath, PASSWORD_SERVICE_MODULE_PATH)
      ),
      importNames(
        [TRANSFORM_STRING_FIELD_UPDATE_INPUT_ID],
        relativeImportPath(modulePath, PRISMA_UTIL_MODULE_PATH)
      ),
    ]);

    addInjectableDependency(
      classDeclaration,
      PASSWORD_SERVICE_MEMBER_ID.name,
      PASSWORD_SERVICE_ID
    );
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
