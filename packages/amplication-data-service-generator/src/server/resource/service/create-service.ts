import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module } from "../../../types";
import { readFile } from "../../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  removeESLintComments,
} from "../../../util/ast";
import { SRC_DIRECTORY } from "../../constants";

const serviceTemplatePath = require.resolve("./service.template.ts");

export async function createServiceModule(
  entity: string,
  entityType: string
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entity}/${entity}.service.ts`;
  const file = await readFile(serviceTemplatePath);
  const serviceId = createServiceId(entityType);

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

export function createServiceId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Service`);
}
