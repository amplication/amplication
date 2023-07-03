import { builders, namedTypes } from "ast-types";
import {
  print,
  readFile,
  removeESLintComments,
  removeTSClassDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import {
  EventNames,
  Module,
  CreateEntityModuleParams,
  CreateEntityModuleBaseParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../utils/module";

import {
  interpolate,
  importNames,
  addAutoGenerationComment,
  addImports,
} from "../../../utils/ast";
import { removeIdentifierFromModuleDecorator } from "../../../utils/nestjs-code-generation";
import { createControllerId } from "../controller/create-controller";
import { createServiceId } from "../service/create-service";
import { createResolverId } from "../resolver/create-resolver";
import DsgContext from "../../../dsg-context";
import pluginWrapper from "../../../plugin-wrapper";

const moduleTemplatePath = require.resolve("./module.template.ts");
const moduleBaseTemplatePath = require.resolve("./module.base.template.ts");

export async function createModules(
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string | undefined,
  entityResolverModule: string | undefined
): Promise<ModuleMap> {
  const moduleBaseId = createBaseModuleId(entityType);
  const moduleTemplate = await readFile(moduleTemplatePath);
  const moduleBaseTemplate = await readFile(moduleBaseTemplatePath);
  const controllerId = createControllerId(entityType);
  const serviceId = createServiceId(entityType);
  const resolverId = createResolverId(entityType);
  const moduleId = createModuleId(entityType);

  const morganModuleId = builders.identifier("MorganModule");

  const importArray = builders.arrayExpression([morganModuleId]);

  const providersArray = builders.arrayExpression([serviceId, resolverId]);

  const moduleTemplateMapping = {
    ENTITY: builders.identifier(entityType),
    PROVIDERS_ARRAY: providersArray,
    SERVICE: serviceId,
    CONTROLLER: controllerId,
    RESOLVER: resolverId,
    MODULE: moduleId,
    MODULE_BASE: moduleBaseId,
  };
  const moduleBaseTemplateMapping = {
    MODULE_BASE: moduleBaseId,
    IMPORTS_ARRAY: importArray,
    EXPORT_ARRAY: importArray,
  };

  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.mergeMany([
    await pluginWrapper(createModule, EventNames.CreateEntityModule, {
      entityName,
      entityType,
      entityServiceModule,
      entityControllerModule,
      entityResolverModule,
      moduleBaseId,
      controllerId,
      serviceId,
      resolverId,
      template: moduleTemplate,
      templateMapping: moduleTemplateMapping,
    }),
    await pluginWrapper(createBaseModule, EventNames.CreateEntityModuleBase, {
      entityName,
      template: moduleBaseTemplate,
      templateMapping: moduleBaseTemplateMapping,
    }),
  ]);
  return moduleMap;
}

async function createModule({
  entityName,
  entityServiceModule,
  entityControllerModule,
  entityResolverModule,
  moduleBaseId,
  controllerId,
  serviceId,
  resolverId,
  template,
  templateMapping,
}: CreateEntityModuleParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/${entityName}.module.ts`;
  const moduleBasePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.module.base.ts`;

  interpolate(template, templateMapping);

  const moduleBaseImport = importNames(
    [moduleBaseId],
    relativeImportPath(modulePath, moduleBasePath)
  );

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  const controllerImport = entityControllerModule
    ? importNames(
        [controllerId],
        relativeImportPath(modulePath, entityControllerModule)
      )
    : undefined;

  // if we are not generating the controller, remove the controller property
  if (!entityControllerModule) {
    removeIdentifierFromModuleDecorator(template, controllerId);
  }

  const resolverImport = entityResolverModule
    ? importNames(
        [resolverId],
        relativeImportPath(modulePath, entityResolverModule)
      )
    : undefined;

  //if we are not generating the resolver, remove it from the providers list
  if (!entityResolverModule) {
    removeIdentifierFromModuleDecorator(template, resolverId);
  }

  addImports(
    template,
    [moduleBaseImport, serviceImport, controllerImport, resolverImport].filter(
      (x) => x //remove nulls and undefined
    ) as namedTypes.ImportDeclaration[]
  );

  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSClassDeclares(template);

  const module: Module = {
    path: modulePath,
    code: print(template).code,
  };
  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}

async function createBaseModule({
  entityName,
  template,
  templateMapping,
}: CreateEntityModuleBaseParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${serverDirectories.srcDirectory}/${entityName}/base/${entityName}.module.base.ts`;

  interpolate(template, templateMapping);

  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSClassDeclares(template);
  addAutoGenerationComment(template);

  const module: Module = {
    path: modulePath,
    code: print(template).code,
  };
  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.set(module);
  return moduleMap;
}

function createModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Module`);
}

function createBaseModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}ModuleBase`);
}
