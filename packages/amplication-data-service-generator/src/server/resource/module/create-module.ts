import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { Module } from "../../../types";
import { relativeImportPath, readFile } from "../../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  importNames,
  addImports,
  removeTSClassDeclares,
  removeESLintComments,
} from "../../../util/ast";
import { SRC_DIRECTORY } from "../../constants";
import { createControllerId } from "../controller/create-controller";
import { createServiceId } from "../service/create-service";
import { createResolverId } from "../resolver/create-resolver";

const moduleTemplatePath = require.resolve("./module.template.ts");

export async function createModule(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string,
  entityResolverModule: string
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.module.ts`;
  const file = await readFile(moduleTemplatePath);
  const controllerId = createControllerId(entityType);
  const serviceId = createServiceId(entityType);
  const resolverId = createResolverId(entityType);
  const moduleId = createModuleId(entityType);

  interpolate(file, {
    ENTITY: builders.identifier(entityType),
    SERVICE: serviceId,
    CONTROLLER: controllerId,
    RESOLVER: resolverId,
    MODULE: moduleId,
  });

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  const controllerImport = importNames(
    [controllerId],
    relativeImportPath(modulePath, entityControllerModule)
  );

  const resolverImport = importNames(
    [resolverId],
    relativeImportPath(modulePath, entityResolverModule)
  );

  addImports(file, [serviceImport, controllerImport, resolverImport]);

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSClassDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

function createModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Module`);
}
