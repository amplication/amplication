import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { ModuleContainer, ModuleMap } from "@amplication/code-gen-types";
import {
  createServiceId,
  createServiceModules,
} from "./custom-service/create-service";
import { createCustomModuleControllerModules } from "./custom-controller/create-controller";
import { createCustomModuleResolverModules } from "./custom-resolver/create-resolver";
import DsgContext from "../../dsg-context";
import { createCustomModule } from "./custom-module/create-module";

export async function createCustomModulesModules(
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const context = DsgContext.getInstance;
  const { moduleContainers } = context;

  const customModuleContainers = moduleContainers.filter(
    (module) => module.entityId === undefined
  );

  const customModules = new ModuleMap(context.logger);
  for await (const customModule of customModuleContainers) {
    await customModules.merge(
      await createSingleCustomModuleModules(customModule, dtoNameToPath)
    );
  }

  return customModules;
}

async function createSingleCustomModuleModules(
  customModule: ModuleContainer,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const customModuleName = customModule.name;
  const context = DsgContext.getInstance;
  const { appInfo } = context;

  //validateEntityName(customModule.name); todo: validate module name

  await context.logger.info(`Creating ${customModuleName}...`);
  const resource = camelCase(plural(camelCase(customModuleName)));
  const serviceId = createServiceId(customModuleName);

  const serviceModules = await createServiceModules(
    customModuleName,
    serviceId,
    dtoNameToPath
  );

  const [serviceModule] = serviceModules.modules();

  const controllerModules =
    (appInfo.settings.serverSettings.generateRestApi &&
      (await createCustomModuleControllerModules(
        resource,
        customModuleName,
        serviceModule.path,
        dtoNameToPath
      ))) ||
    new ModuleMap(DsgContext.getInstance.logger);

  const [controllerModule] = controllerModules.modules();

  // const grpcControllerModules =
  //   (generateGrpc &&
  //     (await createGrpcControllerModules(
  //       resource,
  //       entityName,
  //       entityType,
  //       serviceModule.path,
  //       entity,
  //       dtoNameToPath
  //     ))) ||
  //   new ModuleMap(DsgContext.getInstance.logger);

  // const [grpcControllerModule] = grpcControllerModules.modules();

  const resolverModules =
    (appInfo.settings.serverSettings.generateGraphQL &&
      (await createCustomModuleResolverModules(
        customModuleName,
        serviceModule.path,
        dtoNameToPath
      ))) ||
    new ModuleMap(DsgContext.getInstance.logger);
  const [resolverModule] = resolverModules.modules();

  const customModuleModule = await createCustomModule(
    customModuleName,
    serviceModule.path,
    controllerModule?.path,
    resolverModule?.path
  );

  // const testModule =
  //   (controllerModule &&
  //     (await createEntityControllerSpec(
  //       resource,
  //       entity,
  //       entityType,
  //       serviceModule.path,
  //       controllerModule.path,
  //       controllerBaseModule.path
  //     ))) ||
  //   new ModuleMap(DsgContext.getInstance.logger);

  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.mergeMany([
    serviceModules,
    controllerModules,
    resolverModules,
    customModuleModule,
  ]);

  return moduleMap;
}
