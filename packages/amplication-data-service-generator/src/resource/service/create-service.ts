import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Module, readFile } from "../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  removeESLintComments,
} from "../../util/ast";

const serviceTemplatePath = require.resolve("./service.template.ts");

export async function createServiceModule(
  entity: string,
  entityType: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.service.ts`);
  const file = await readFile(serviceTemplatePath);
  const serviceId = builders.identifier(`${entityType}Service`);

  interpolate(file, {
    SERVICE: serviceId,
    ENTITY: builders.identifier(entityType),
    CREATE_ARGS: builders.identifier(`${entityType}CreateArgs`),
    FIND_MANY_ARGS: builders.identifier(`FindMany${entityType}Args`),
    FIND_ONE_ARGS: builders.identifier(`FindOne${entityType}Args`),
    UPDATE_ARGS: builders.identifier(`${entityType}UpdateArgs`),
    DELETE_ARGS: builders.identifier(`${entityType}DeleteArgs`),
    DELEGATE: builders.identifier(entity),
  });

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}
