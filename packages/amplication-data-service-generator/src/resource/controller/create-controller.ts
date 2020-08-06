import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Module, readFile, relativeImportPath } from "../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  importNames,
  addImports,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
} from "../../util/ast";
import {
  PrismaAction,
  createPrismaArgsID,
} from "../../util/prisma-code-generation";

const controllerTemplatePath = require.resolve("./controller.template.ts");

export async function createControllerModule(
  resource: string,
  entity: string,
  entityType: string,
  entityServiceModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.controller.ts`);
  const file = await readFile(controllerTemplatePath);

  const serviceId = builders.identifier(`${entityType}Service`);
  const controllerId = builders.identifier(`${entityType}Controller`);
  const entityTypeId = builders.identifier(entityType);

  interpolate(file, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: controllerId,
    SERVICE: serviceId,
    ENTITY: entityTypeId,
    CREATE_ARGS: createPrismaArgsID(PrismaAction.Create, entityType),
    /** @todo replace */
    CREATE_QUERY: builders.tsTypeLiteral([]),
    CREATE_INPUT: builders.identifier(`${entityType}CreateInput`),
    FIND_MANY_ARGS: createPrismaArgsID(PrismaAction.FindMany, entityType),
    /** @todo extend */
    WHERE_INPUT: builders.identifier(`${entityType}WhereInput`),
    FIND_ONE_ARGS: createPrismaArgsID(PrismaAction.FindOne, entityType),
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    /** @todo replace */
    FIND_ONE_QUERY: builders.tsTypeLiteral([]),
    WHERE_UNIQUE_INPUT: builders.identifier(`${entityType}WhereUniqueInput`),
  });

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  addImports(file, [serviceImport]);
  removeTSIgnoreComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}
