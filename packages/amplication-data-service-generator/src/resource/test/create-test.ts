import * as path from "path";
import { namedTypes, builders } from "ast-types";
import { print } from "recast";
import { camelCase } from "camel-case";
import { ScalarType, ObjectField, ScalarField } from "prisma-schema-dsl";
import { readFile, Module, relativeImportPath } from "../../util/module";
import {
  interpolate,
  removeTSVariableDeclares,
  importNames,
  addImports,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
} from "../../util/ast";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import { Entity, EntityField } from "../../types";

const testTemplatePath = require.resolve("./test.template.ts");

export async function createTestModule(
  resource: string,
  entity: Entity,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityModule: string,
  entityIdToName: Record<string, string>
): Promise<Module> {
  const modulePath = path.join(entityName, `${entityName}.test.ts`);
  const file = await readFile(testTemplatePath);
  const moduleId = builders.identifier(`${entityType}Module`);
  const serviceId = builders.identifier(`${entityType}Service`);

  /** @todo make dynamic */
  const param = "id";
  const paramType = builders.tsStringKeyword();

  const existingParam = camelCase(["existing", param].join(" "));
  const nonExistingParam = camelCase(["nonExisting", param].join(" "));
  const createInputId = builders.identifier(
    `${camelCase(entityType)}CreateInput`
  );

  interpolate(file, {
    MODULE: moduleId,
    SERVICE: serviceId,
    TEST_NAME: builders.stringLiteral(entityType),
    ENTITY_TYPE: builders.identifier(entityType),
    EXISTING_PARAM_ID: builders.identifier(existingParam),
    EXISTING_PARAM: builders.stringLiteral(existingParam),
    NON_EXISTING_PARAM_ID: builders.identifier(nonExistingParam),
    NON_EXISTING_PARAM: builders.stringLiteral(nonExistingParam),
    CREATE_PATHNAME: builders.stringLiteral(`/${resource}`),
    CREATE_INPUT_ID: createInputId,
    CREATE_INPUT_TYPE: builders.identifier("inputType"),
    CREATE_INPUT: createTestData(entity.fields, entityIdToName),
    CREATE_RESULT: createTestData(entity.fields, entityIdToName),
    CREATE_RESULT_ID: builders.identifier("createResult"),
    FIND_MANY_PATHNAME: builders.stringLiteral(`/${resource}`),
    FIND_MANY_RESULT: builders.arrayExpression([
      createTestData(entity.fields, entityIdToName),
    ]),
    FIND_MANY_RESULT_ID: builders.identifier("findManyResult"),
    FIND_ONE_PATHNAME: builders.stringLiteral(`/${resource}/:${param}`),
    RESOURCE: builders.stringLiteral(resource),
    FIND_ONE_PARAM: paramType,
    FIND_ONE_PARAM_NAME: builders.stringLiteral(param),
    FIND_ONE_RESULT: createTestData(entity.fields, entityIdToName),
    FIND_ONE_RESULT_ID: builders.identifier("findOneResult"),
  });

  const importResourceModule = importNames(
    [moduleId],
    relativeImportPath(modulePath, entityModule)
  );
  const importService = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  addImports(file, [importResourceModule, importService]);

  removeTSVariableDeclares(file);
  removeTSClassDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

function createTestData(
  fields: EntityField[],
  entityIdToName: Record<string, string>
): namedTypes.ObjectExpression {
  return builders.objectExpression(
    fields
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
    return builders.arrayExpression([
      createFieldTestValueFromPrisma({
        ...prismaField,
        isList: false,
      }),
    ]);
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
