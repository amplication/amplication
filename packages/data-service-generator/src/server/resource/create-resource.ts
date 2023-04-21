import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { Entity, ModuleMap } from "@amplication/code-gen-types";
import { validateEntityName } from "../../utils/entity";
import {
  createServiceBaseId,
  createServiceId,
  createServiceModules,
} from "./service/create-service";
import { createControllerModules } from "./controller/create-controller";
import { createModules } from "./module/create-module";
import { createEntityControllerSpec } from "./test/create-controller-spec";
import { createResolverModules } from "./resolver/create-resolver";
import { builders } from "ast-types";
import DsgContext from "../../dsg-context";
import { logger } from "../../logging";

export async function createResourcesModules(
  entities: Entity[]
): Promise<ModuleMap> {
  const resourceModules = new ModuleMap();

  const resourceModuleMaps = await Promise.all(
    entities.map(createResourceModules)
  );

  resourceModuleMaps.forEach((resourceModuleMap) => {
    resourceModules.merge(resourceModuleMap, logger);
  });

  return resourceModules;
}

async function createResourceModules(entity: Entity): Promise<ModuleMap> {
  const entityType = entity.name;
  const context = DsgContext.getInstance;
  const { appInfo } = context;

  validateEntityName(entity);

  await context.logger.info(`Creating ${entityType}...`);
  const entityName = camelCase(entityType);
  const resource = camelCase(plural(entityName));
  const serviceId = createServiceId(entityType);
  const serviceBaseId = createServiceBaseId(entityType);
  const delegateId = builders.identifier(entityName);

  const serviceModules = await createServiceModules(
    entityName,
    entityType,
    entity,
    serviceId,
    serviceBaseId,
    delegateId
  );

  const [serviceModule] = serviceModules.values();

  const controllerModules =
    (appInfo.settings.serverSettings.generateRestApi &&
      (await createControllerModules(
        resource,
        entityName,
        entityType,
        serviceModule.path,
        entity
      ))) ||
    new ModuleMap();

  const [controllerModule, controllerBaseModule] = controllerModules.values();

  const resolverModules =
    (appInfo.settings.serverSettings.generateGraphQL &&
      (await createResolverModules(
        entityName,
        entityType,
        serviceModule.path,
        entity
      ))) ||
    new ModuleMap();
  const [resolverModule] = resolverModules.values();

  const resourceModules = await createModules(
    entityName,
    entityType,
    serviceModule.path,
    controllerModule?.path,
    resolverModule?.path
  );

  const testModule =
    (controllerModule &&
      (await createEntityControllerSpec(
        resource,
        entity,
        entityType,
        serviceModule.path,
        controllerModule.path,
        controllerBaseModule.path
      ))) ||
    new ModuleMap();

  return new ModuleMap([
    ...serviceModules,
    ...controllerModules,
    ...resolverModules,
    ...resourceModules,
    ...testModule,
  ]);
}
