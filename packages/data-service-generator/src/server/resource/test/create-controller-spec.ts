import { namedTypes, builders } from "ast-types";
import * as kinds from "ast-types/gen/kinds";
import {
  print,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { camelCase } from "camel-case";
import replaceExt from "replace-ext";
import { ScalarType, ObjectField, ScalarField } from "prisma-schema-dsl-types";
import { readFile, removeESLintComments } from "@amplication/code-gen-utils";
import { relativeImportPath } from "../../../utils/module";
import { interpolate, importNames, addImports } from "../../../utils/ast";
import { createPrismaFields } from "../../prisma/create-prisma-schema-fields";
import {
  CreateEntityControllerSpecParams,
  Entity,
  EntityField,
  EventNames,
  Module,
  ModuleMap,
} from "@amplication/code-gen-types";
import { isOneToOneRelationField, isRelationField } from "../../../utils/field";
import { createServiceId } from "../service/create-service";
import { createControllerId } from "../controller/create-controller";
import pluginWrapper from "../../../plugin-wrapper";
import DsgContext from "../../../dsg-context";

const testTemplatePath = require.resolve("./controller.spec.template.ts");
const TO_ISO_STRING_ID = builders.identifier("toISOString");
const CREATE_RESULT_ID = builders.identifier("CREATE_RESULT");
const FIND_ONE_RESULT_ID = builders.identifier("FIND_ONE_RESULT");
const FIND_MANY_RESULT_ID = builders.identifier("FIND_MANY_RESULT");

export async function createEntityControllerSpec(
  resource: string,
  entity: Entity,
  entityType: string,
  entityServiceModulePath: string,
  entityControllerModulePath: string,
  entityControllerBaseModulePath: string
): Promise<ModuleMap> {
  /** @todo make dynamic */
  const param = "id";
  const paramType = builders.tsStringKeyword();
  const existingParam = camelCase(["existing", param].join(" "));
  const nonExistingParam = camelCase(["nonExisting", param].join(" "));
  const serviceId = createServiceId(entityType);
  const controllerId = createControllerId(entityType);
  const fieldNameToPrismField = Object.fromEntries(
    entity.fields.map((field) => [
      field.name,
      createPrismaFields(field, entity)[0],
    ])
  );

  const template = await readFile(testTemplatePath);
  const templateMapping = {
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
    CREATE_INPUT_VALUE: createTestData(entity),
    CREATE_RESULT_VALUE: createTestData(entity),
    CREATE_EXPECTED_RESULT: createExpectedResult(
      CREATE_RESULT_ID,
      entity.fields,
      fieldNameToPrismField
    ),
    FIND_MANY_PATHNAME: builders.stringLiteral(`/${resource}`),
    FIND_MANY_RESULT_VALUE: builders.arrayExpression([createTestData(entity)]),
    FIND_MANY_EXPECTED_RESULT: builders.arrayExpression([
      createExpectedResult(
        builders.memberExpression(FIND_MANY_RESULT_ID, builders.literal(0)),
        entity.fields,
        fieldNameToPrismField
      ),
    ]),
    FIND_ONE_PATHNAME: builders.stringLiteral(`/${resource}/:${param}`),
    RESOURCE: builders.stringLiteral(`/${resource}`),
    FIND_ONE_PARAM: paramType,
    FIND_ONE_PARAM_NAME: builders.stringLiteral(param),
    FIND_ONE_RESULT_VALUE: createTestData(entity),
    FIND_ONE_EXPECTED_RESULT: createExpectedResult(
      FIND_ONE_RESULT_ID,
      entity.fields,
      fieldNameToPrismField
    ),
  };

  return pluginWrapper(
    createEntityControllerSpecInternal,
    EventNames.CreateEntityControllerSpec,
    {
      entity,
      entityType,
      template,
      templateMapping,
      entityServiceModulePath,
      entityControllerModulePath,
      entityControllerBaseModulePath,
      controllerId,
      serviceId,
    }
  );
}

export async function createEntityControllerSpecInternal({
  template,
  templateMapping,
  entityServiceModulePath,
  entityControllerModulePath,
  entityControllerBaseModulePath,
  controllerId,
  serviceId,
}: CreateEntityControllerSpecParams): Promise<ModuleMap> {
  const modulePath = replaceExt(entityControllerBaseModulePath, ".spec.ts");

  const importResourceModule = importNames(
    [controllerId],
    relativeImportPath(modulePath, entityControllerModulePath)
  );
  const importService = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModulePath)
  );

  interpolate(template, templateMapping);

  addImports(template, [importResourceModule, importService]);

  removeESLintComments(template);
  removeTSIgnoreComments(template);
  removeTSVariableDeclares(template);
  removeTSClassDeclares(template);
  removeTSInterfaceDeclares(template);

  const module: Module = {
    path: modulePath,
    code: print(template).code,
  };
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.set(module);
  return moduleMap;
}

function createExpectedResult<T extends kinds.ExpressionKind>(
  object: T,
  fields: EntityField[],
  fieldNameToPrismField: Record<string, ScalarField | ObjectField>
): T | namedTypes.ObjectExpression {
  const prismaFields = fields.map((field) => fieldNameToPrismField[field.name]);
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

function createTestData(entity: Entity): namedTypes.ObjectExpression {
  return builders.objectExpression(
    entity.fields
      .filter(
        (field) => !isRelationField(field) || isOneToOneRelationField(field)
      )
      .map((field) => {
        const value = createFieldTestValue(field, entity);
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

function createFieldTestValue(field: EntityField, entity: Entity): TestValue {
  // Use Prisma type as it already reduces the amount of possible types
  const [prismaField] = createPrismaFields(field, entity);
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
    case ScalarType.BigInt: {
      return builders.numericLiteral(42242424);
    }
    case ScalarType.Decimal: {
      return builders.numericLiteral(42.424242424);
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
