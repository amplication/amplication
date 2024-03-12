import { builders, namedTypes } from "ast-types";
import {
  print,
  readFile,
  removeESLintComments,
  removeTSClassDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import {
  Module,
  ModuleMap,
  CreateCustomModuleModuleParams,
} from "@amplication/code-gen-types";
import { relativeImportPath } from "../../../utils/module";

import { interpolate, importNames, addImports } from "../../../utils/ast";
import { removeIdentifierFromModuleDecorator } from "../../../utils/nestjs-code-generation";
import DsgContext from "../../../dsg-context";
import { createControllerId } from "../custom-controller/create-controller";
import { createServiceId } from "../custom-service/create-service";
import { createResolverId } from "../custom-resolver/create-resolver";

const moduleTemplatePath = require.resolve("./module.template.ts");

export async function createCustomModule(
  customModuleName: string,
  entityServiceModule: string,
  entityControllerModule: string | undefined,
  entityResolverModule: string | undefined
): Promise<ModuleMap> {
  const moduleTemplate = await readFile(moduleTemplatePath);
  const controllerId = createControllerId(customModuleName);
  const serviceId = createServiceId(customModuleName);
  const resolverId = createResolverId(customModuleName);
  const moduleId = createModuleId(customModuleName);

  const providersArray = builders.arrayExpression([serviceId, resolverId]);

  const moduleTemplateMapping = {
    PROVIDERS_ARRAY: providersArray,
    SERVICE: serviceId,
    CONTROLLER: controllerId,
    RESOLVER: resolverId,
    MODULE: moduleId,
  };

  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.merge(
    await createModule({
      customModuleName,
      entityServiceModule,
      entityControllerModule,
      entityResolverModule,
      controllerId,
      serviceId,
      resolverId,
      template: moduleTemplate,
      templateMapping: moduleTemplateMapping,
    })
    // await pluginWrapper(createModule, EventNames.CreateEntityModule, {
    //   customModuleName,
    //   entityServiceModule,
    //   entityControllerModule,
    //   entityResolverModule,
    //   controllerId,
    //   serviceId,
    //   resolverId,
    //   template: moduleTemplate,
    //   templateMapping: moduleTemplateMapping,
    // })
  );
  return moduleMap;
}

async function createModule({
  customModuleName,
  entityServiceModule,
  entityControllerModule,
  entityResolverModule,
  controllerId,
  serviceId,
  resolverId,
  template,
  templateMapping,
}: CreateCustomModuleModuleParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${
    serverDirectories.srcDirectory
  }/${customModuleName}/${customModuleName.toLowerCase()}.module.ts`;

  interpolate(template, templateMapping);

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
    [serviceImport, controllerImport, resolverImport].filter(
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

function createModuleId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Module`);
}
