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
const moduleBaseTemplatePath = require.resolve("./module.base.template.ts");

export async function createModules(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string,
  entityResolverModule: string
): Promise<Module[]> {
  const moduleBaseId = createBaseModuleId(entityType);

  return [
    await createModule(
      entityName,
      entityType,
      entityServiceModule,
      entityControllerModule,
      entityResolverModule,
      moduleBaseId
    ),
    await createBaseModule(entityName, moduleBaseId),
  ];
}

async function createModule(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string,
  entityResolverModule: string,
  moduleBaseId: namedTypes.Identifier
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.module.ts`;
  const moduleBasePath = `${SRC_DIRECTORY}/${entityName}/base/${entityName}.module.base.ts`;
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
    MODULE_BASE: moduleBaseId,
  });
  const moduleBaseImport = importNames(
    [moduleBaseId],
    relativeImportPath(modulePath, moduleBasePath)
  );

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

  addImports(file, [
    moduleBaseImport,
    serviceImport,
    controllerImport,
    resolverImport,
  ]);

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSClassDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

async function createBaseModule(
  entityName: string,
  moduleBaseId: namedTypes.Identifier
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/base/${entityName}.module.base.ts`;
  const file = await readFile(moduleBaseTemplatePath);

  interpolate(file, {
    MODULE_BASE: moduleBaseId,
  });

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

function createBaseModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}ModuleBase`);
}
