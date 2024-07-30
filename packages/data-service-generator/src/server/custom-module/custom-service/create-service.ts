import { builders, namedTypes } from "ast-types";
import {
  print,
  readFile,
  removeESLintComments,
  removeTSVariableDeclares,
  removeTSClassDeclares,
  removeTSInterfaceDeclares,
  removeTSIgnoreComments,
} from "@amplication/code-gen-utils";
import {
  Module,
  ModuleMap,
  CreateCustomModuleServiceParams,
} from "@amplication/code-gen-types";
import {
  addImports,
  getClassDeclarationById,
  importContainedIdentifiers,
  interpolate,
} from "../../../utils/ast";
import DsgContext from "../../../dsg-context";
import { getImportableDTOs } from "../../resource/dto/create-dto-module";
import { createCustomActionMethods } from "../../resource/service/create-custom-action";

const serviceTemplatePath = require.resolve("./service.template.ts");

export async function createServiceModules(
  customModuleName: string,
  serviceId: namedTypes.Identifier,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const template = await readFile(serviceTemplatePath);

  const templateMapping = createTemplateMapping(serviceId);
  const { moduleActionsAndDtoMap } = DsgContext.getInstance;
  const moduleActions = moduleActionsAndDtoMap[customModuleName].actions;

  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);

  await moduleMap.merge(
    await createServiceModule({
      customModuleName,
      templateMapping,
      serviceId,
      template,
      moduleActions,
      dtoNameToPath,
    } as CreateCustomModuleServiceParams)
    // await pluginWrapper(createServiceModule, EventNames.CreateEntityService, {
    //   customModuleName,
    //   templateMapping,
    //   serviceId,
    //   template,
    //   moduleActions,
    //   dtoNameToPath,
    // } as CreateCustomModuleServiceParams)
  );

  return moduleMap;
}

async function createServiceModule({
  customModuleName,
  templateMapping,
  serviceId,
  template,
  moduleActions,
  dtoNameToPath,
}: CreateCustomModuleServiceParams): Promise<ModuleMap> {
  const { serverDirectories } = DsgContext.getInstance;
  const modulePath = `${
    serverDirectories.srcDirectory
  }/${customModuleName.toLowerCase()}/${customModuleName.toLowerCase()}.service.ts`;

  interpolate(template, templateMapping);

  const classDeclaration = getClassDeclarationById(template, serviceId);

  classDeclaration.body.body.push(
    ...(await createCustomActionMethods(moduleActions))
  );

  removeTSClassDeclares(template);
  removeTSIgnoreComments(template);
  removeESLintComments(template);
  removeTSVariableDeclares(template);
  removeTSInterfaceDeclares(template);

  const dtoImports = importContainedIdentifiers(
    template,
    getImportableDTOs(modulePath, dtoNameToPath)
  );
  addImports(template, [...dtoImports]);

  const module: Module = {
    path: modulePath,
    code: print(template).code,
  };
  const moduleMap = new ModuleMap(DsgContext.getInstance.logger);
  await moduleMap.set(module);
  return moduleMap;
}

export function createServiceId(
  customModuleName: string
): namedTypes.Identifier {
  return builders.identifier(`${customModuleName}Service`);
}

function createTemplateMapping(serviceId: namedTypes.Identifier): {
  [key: string]: any;
} {
  return {
    SERVICE: serviceId,
  };
}
