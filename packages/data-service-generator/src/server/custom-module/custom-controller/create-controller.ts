import {
  print,
  readFile,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import { builders, namedTypes } from "ast-types";
import {
  Module,
  ModuleMap,
  CreateCustomModuleControllerParams,
} from "@amplication/code-gen-types";

import {
  interpolate,
  getClassDeclarationById,
  addImports,
  importContainedIdentifiers,
  importNames,
} from "../../../utils/ast";
import { getSwaggerAuthDecorationIdForClass } from "../../swagger/create-swagger";
import DsgContext from "../../../dsg-context";
import { createServiceId } from "../custom-service/create-service";
import { createControllerCustomActionMethods } from "../../resource/controller/create-controller-custom-actions";
import { IMPORTABLE_IDENTIFIERS_NAMES } from "../../../utils/identifiers-imports";
import { relativeImportPath } from "../../../utils/module";
import { getImportableDTOs } from "../../resource/dto/create-dto-module";

const controllerTemplatePath = require.resolve("./controller.template.ts");

export async function createCustomModuleControllerModules(
  resource: string,
  customModuleName: string,
  customModuleServiceModule: string,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { appInfo, moduleActionsAndDtoMap } = DsgContext.getInstance;
  const { settings } = appInfo;
  const { authProvider } = settings;

  const moduleActions = moduleActionsAndDtoMap[customModuleName].actions;

  const template = await readFile(controllerTemplatePath);

  const controllerId = createControllerId(customModuleName);
  const serviceId = createServiceId(customModuleName);

  const templateMapping = {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: controllerId,
    SERVICE: serviceId,
    SWAGGER_API_AUTH_FUNCTION: getSwaggerAuthDecorationIdForClass(authProvider),
  };

  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.merge(
    await createControllerModule({
      template,
      customModuleName,
      templateMapping,
      controllerId,
      serviceId,
      moduleActions,
      customModuleServiceModule,
      dtoNameToPath,
    } as CreateCustomModuleControllerParams)
    // await pluginWrapper(
    //   createControllerModule,
    //   EventNames.CreateEntityController,
    //   {
    //     template,
    //     customModuleName,
    //     templateMapping,
    //     controllerId,
    //     serviceId,
    //     moduleActions,
    //   } as CreateCustomModuleControllerParams
    // )
  );

  return moduleMap;
}

async function createControllerModule({
  template,
  customModuleName,
  templateMapping,
  controllerId,
  moduleActions,
  serviceId,
  customModuleServiceModule,
  dtoNameToPath,
}: CreateCustomModuleControllerParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${
    serverDirectories.srcDirectory
  }/${customModuleName.toLowerCase()}/${customModuleName.toLowerCase()}.controller.ts`;

  interpolate(template, templateMapping);

  const classDeclaration = getClassDeclarationById(template, controllerId);

  classDeclaration.body.body.push(
    ...(await createControllerCustomActionMethods(moduleActions))
  );

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, customModuleServiceModule)
  );

  const dtoImports = importContainedIdentifiers(
    template,
    getImportableDTOs(modulePath, dtoNameToPath)
  );
  const identifiersImports = importContainedIdentifiers(
    template,
    IMPORTABLE_IDENTIFIERS_NAMES
  );
  addImports(template, [serviceImport, ...identifiersImports, ...dtoImports]);

  removeTSIgnoreComments(template);
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

export function createControllerId(
  customModuleName: string
): namedTypes.Identifier {
  return builders.identifier(`${customModuleName}Controller`);
}
