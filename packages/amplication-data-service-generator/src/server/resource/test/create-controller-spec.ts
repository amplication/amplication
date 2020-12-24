import { namedTypes, builders } from "ast-types";
import * as kinds from "ast-types/gen/kinds";
import { print } from "recast";
import { camelCase } from "camel-case";
import replaceExt from "replace-ext";
import { ScalarType, ObjectField, ScalarField } from "prisma-schema-dsl";
import { readFile, relativeImportPath } from "../../../util/module";
import {
  interpolate,
  removeTSVariableDeclares,
  importNames,
  addImports,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
  removeESLintComments,
} from "../../../util/ast";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import { Entity, EntityField, Module } from "../../../types";
import { isOneToOneRelationField, isRelationField } from "../../../util/field";
import { createServiceId } from "../service/create-service";
import { createControllerId } from "../controller/create-controller";

const testTemplatePath = require.resolve("./controller.spec.template.ts");
const TO_ISO_STRING_ID = builders.identifier("toISOString");
const CREATE_RESULT_ID = builders.identifier("CREATE_RESULT");
const FIND_ONE_RESULT_ID = builders.identifier("FIND_ONE_RESULT");
const FIND_MANY_RESULT_ID = builders.identifier("FIND_MANY_RESULT");

export async function createControllerSpecModule(
  resource: string,
  entity: Entity,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string,
  entityIdToName: Record<string, string>
): Promise<Module> {
  const modulePath = replaceExt(entityControllerModule, ".spec.ts");
  const file = await readFile(testTemplatePath);
  const serviceId = createServiceId(entityType);
  const controllerId = createControllerId(entityType);

  /** @todo make dynamic */
  const param = "id";
  const paramType = builders.tsStringKeyword();

  const existingParam = camelCase(["existing", param].join(" "));
  const nonExistingParam = camelCase(["nonExisting", param].join(" "));

  interpolate(file, {
    CONTROLLER: controllerId,
    SERVICE: serviceId,
    TEST_NAME: builders.stringLiteral(entityType),
    ENTITY_TYPE: builders.identifier(entityType),
    EXISTING_PARAM_ID: builders.identifier(existingParam),
    EXISTING_PARAM: builders.stringLiteral(existingParam),
    NON_EXISTING_PARAM_ID: builders.identifier(nonExistingParam),
    NON_EXISTING_PARAM: builders.stringLiteral(nonExistingParam),
    CREATE_PATHNAME: builders.stringLiteral(`/${resource}`),
    CREATE_INPUT_TYPE: builders.identifier(`Create${entityType}`),
    CREATE_INPUT_VALUE: createTestData(entity.fields, entityIdToName),
    CREATE_RESULT_VALUE: createTestData(entity.fields, entityIdToName),
    CREATE_EXPECTED_RESULT: createExpectedResult(
      CREATE_RESULT_ID,
      entity.fields
    ),
    FIND_MANY_PATHNAME: builders.stringLiteral(`/${resource}`),
    FIND_MANY_RESULT_VALUE: builders.arrayExpression([
      createTestData(entity.fields, entityIdToName),
    ]),
    FIND_MANY_EXPECTED_RESULT: builders.arrayExpression([
      createExpectedResult(
        builders.memberExpression(FIND_MANY_RESULT_ID, builders.literal(0)),
        entity.fields
      ),
    ]),
    FIND_ONE_PATHNAME: builders.stringLiteral(`/${resource}/:${param}`),
    RESOURCE: builders.stringLiteral(`/${resource}`),
    FIND_ONE_PARAM: paramType,
    FIND_ONE_PARAM_NAME: builders.stringLiteral(param),
    FIND_ONE_RESULT_VALUE: createTestData(entity.fields, entityIdToName),
    FIND_ONE_EXPECTED_RESULT: createExpectedResult(
      FIND_ONE_RESULT_ID,
      entity.fields
    ),
  });

  const importResourceModule = importNames(
    [controllerId],
    relativeImportPath(modulePath, entityControllerModule)
  );
  const importService = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  addImports(file, [importResourceModule, importService]);

  removeESLintComments(file);
  removeTSIgnoreComments(file);
  removeTSVariableDeclares(file);
  removeTSClassDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

function createExpectedResult<T extends kinds.ExpressionKind>(
  object: T,
  fields: EntityField[]
): T | namedTypes.ObjectExpression {
  const prismaFields = fields.map((field) =>
    createPrismaField(field, {}, true)
  );
  const dateFields = prismaFields.filter((field) => {
    return field.type === ScalarType.DateTime;
  });
  if (!dateFields.length) {
    return object;
  }
  return builders.objectExpression([
    builders.spreadProperty(object),
    ...dateFields.map((field) => {
      const nameId = builders.identifier(field.name);
      const isoStringCallExpression = createToISOStringCallExpression(
        builders.memberExpression(object, nameId)
      );
      const value = field.isList
        ? builders.arrayExpression([isoStringCallExpression])
        : isoStringCallExpression;
      return builders.objectProperty(nameId, value);
    }),
  ]);
}

function createToISOStringCallExpression(
  object: kinds.ExpressionKind
): namedTypes.CallExpression {
  return builders.callExpression(
    builders.memberExpression(object, TO_ISO_STRING_ID),
    []
  );
}

function createTestData(
  fields: EntityField[],
  entityIdToName: Record<string, string>
): namedTypes.ObjectExpression {
  return builders.objectExpression(
    fields
      .filter(
        (field) => !isRelationField(field) || isOneToOneRelationField(field)
      )
      .map((field) => {
        const value = createFieldTestValue(field, entityIdToName);
        return (
          value &&
          builders.property("init", builders.identifier(field.name), value)
        );
      })
      .filter((field): field is namedTypes.Property => field !== null)
  );
}

type TestValue =
  | namedTypes.ArrayExpression
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.Literal
  | namedTypes.NewExpression
  | null;

function createFieldTestValue(
  field: EntityField,
  entityIdToName: Record<string, string>
): TestValue {
  // Use Prisma type as it already reduces the amount of possible types
  const prismaField = createPrismaField(field, entityIdToName);
  if (prismaField.isList) {
    const value = createFieldTestValueFromPrisma({
      ...prismaField,
      isList: false,
    });
    return value && builders.arrayExpression([value]);
  }
  return createFieldTestValueFromPrisma(prismaField);
}

function createFieldTestValueFromPrisma(
  prismaField: ObjectField | ScalarField
): TestValue {
  switch (prismaField.type) {
    case ScalarType.String: {
      return builders.stringLiteral(camelCase(`example ${prismaField.name}`));
    }
    case ScalarType.Int: {
      return builders.numericLiteral(42);
    }
    case ScalarType.Float: {
      return builders.numericLiteral(42.42);
    }
    case ScalarType.Boolean: {
      return builders.literal("true");
    }
    case ScalarType.DateTime: {
      return builders.newExpression(builders.identifier("Date"), []);
    }
    default: {
      return null;
    }
  }
}
