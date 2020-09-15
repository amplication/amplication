import * as path from "path";
import { namedTypes, builders } from "ast-types";
import { print } from "recast";
import { camelCase } from "camel-case";
import { ScalarType } from "prisma-schema-dsl";
import { readFile, Module, relativeImportPath } from "../../util/module";
import {
  interpolate,
  removeTSVariableDeclares,
  importNames,
  addImports,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
} from "../../util/ast";
import { EntityField } from "../../models";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import { FullEntity } from "../../types";

const testTemplatePath = require.resolve("./test.template.ts");

export async function createTestModule(
  resource: string,
  entity: FullEntity,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityModule: string
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
    CREATE_INPUT: createTestData(entity.fields),
    CREATE_RESULT: createTestData(entity.fields),
    CREATE_RESULT_ID: builders.identifier("createResult"),
    FIND_MANY_PATHNAME: builders.stringLiteral(`/${resource}`),
    FIND_MANY_RESULT: builders.arrayExpression([createTestData(entity.fields)]),
    FIND_MANY_RESULT_ID: builders.identifier("findManyResult"),
    FIND_ONE_PATHNAME: builders.stringLiteral(`/${resource}/:${param}`),
    RESOURCE: builders.stringLiteral(resource),
    FIND_ONE_PARAM: paramType,
    FIND_ONE_PARAM_NAME: builders.stringLiteral(param),
    FIND_ONE_RESULT: createTestData(entity.fields),
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

function createTestData(fields: EntityField[]): namedTypes.ObjectExpression {
  return builders.objectExpression(
    fields.map((field) => {
      return builders.property(
        "init",
        builders.identifier(field.name),
        createFieldTestValue(field)
      );
    })
  );
}

function createFieldTestValue(
  field: EntityField
):
  | namedTypes.ArrayExpression
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.Literal
  | namedTypes.NewExpression {
  // Use Prisma type as it already reduces the amount of possible types
  const prismaField = createPrismaField(field);
  if (prismaField.isList) {
    return builders.arrayExpression([createFieldTestValue(field)]);
  }
  switch (prismaField.type) {
    case ScalarType.String: {
      return builders.stringLiteral(camelCase(`example ${field.name}`));
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
      throw new Error("Not implemented");
    }
  }
}
