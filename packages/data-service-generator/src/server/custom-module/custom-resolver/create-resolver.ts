import {
  print,
  readFile,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
  removeImportsTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import {
  Module,
  ModuleMap,
  CreateCustomModuleResolverParams,
} from "@amplication/code-gen-types";

import {
  interpolate,
  addImports,
  importContainedIdentifiers,
  getClassDeclarationById,
  importNames,
} from "../../../utils/ast";
import { createServiceId } from "../custom-service/create-service";
import { IMPORTABLE_IDENTIFIERS_NAMES } from "../../../utils/identifiers-imports";
import DsgContext from "../../../dsg-context";
import { createResolverCustomActionMethods } from "./create-resolver-custom-actions";
import { relativeImportPath } from "../../../utils/module";
import { getImportableDTOs } from "../../resource/dto/create-dto-module";

const resolverTemplatePath = require.resolve("./resolver.template.ts");

export async function createCustomModuleResolverModules(
  customModuleName: string,
  customModuleServiceModule: string,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const serviceId = createServiceId(customModuleName);
  const resolverId = createResolverId(customModuleName);
  const { moduleActionsAndDtoMap } = DsgContext.getInstance;

  const moduleActions = moduleActionsAndDtoMap[customModuleName].actions;

  const template = await readFile(resolverTemplatePath);

  const templateMapping = {
    RESOLVER: resolverId,
    SERVICE: serviceId,
  };

  const context = DsgContext.getInstance;
  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.merge(
    await createResolverModule({
      template,
      customModuleName,
      resolverId,
      serviceId,
      templateMapping,
      moduleActions,
      customModuleServiceModule,
      dtoNameToPath,
    } as CreateCustomModuleResolverParams)
    // await pluginWrapper(createResolverModule, EventNames.CreateEntityResolver, {
    //   template,
    //   customModuleName,
    //   resolverId,
    //   serviceId,
    //   templateMapping,
    //   moduleActions,
    // } as CreateCustomModuleResolverParams)
  );

  return moduleMap;
}

async function createResolverModule({
  template,
  customModuleName,
  resolverId,
  serviceId,
  templateMapping,
  moduleActions,
  customModuleServiceModule,
  dtoNameToPath,
}: CreateCustomModuleResolverParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${
    serverDirectories.srcDirectory
  }/${customModuleName.toLowerCase()}/${customModuleName.toLowerCase()}.resolver.ts`;

  interpolate(template, templateMapping);

  const classDeclaration = getClassDeclarationById(template, resolverId);

  classDeclaration.body.body.push(
    ...(await createResolverCustomActionMethods(moduleActions))
  );

  const dtoImports = importContainedIdentifiers(
    template,
    getImportableDTOs(modulePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    template,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(template, [...identifiersImports, ...dtoImports]);

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, customModuleServiceModule)
  );

  addImports(template, [serviceImport]);
  removeTSIgnoreComments(template);
  removeImportsTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);
  removeTSInterfaceDeclares(template);
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

export function createResolverId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Resolver`);
}
