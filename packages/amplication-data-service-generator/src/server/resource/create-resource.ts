import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { flatten } from "lodash";
import * as winston from "winston";
import { Entity, Module, AppInfo, DTOs } from "@amplication/code-gen-types";
import { validateEntityName } from "../../util/entity";
import { createServiceModules } from "./service/create-service";
import { createControllerModules } from "./controller/create-controller";
import { createModules } from "./module/create-module";
import { createControllerSpecModule } from "./test/create-controller-spec";
import { createResolverModules } from "./resolver/create-resolver";

export async function createResourcesModules(
  appInfo: AppInfo,
  entities: Entity[],
  dtos: DTOs,
  logger: winston.Logger,
  srcDirectory: string
): Promise<Module[]> {
  const resourceModuleLists = await Promise.all(
    entities.map((entity) =>
      createResourceModules(appInfo, entity, dtos, logger, srcDirectory)
    )
  );
  const resourcesModules = flatten(resourceModuleLists);
  return resourcesModules;
}

async function createResourceModules(
  appInfo: AppInfo,
  entity: Entity,
  dtos: DTOs,
  logger: winston.Logger,
  srcDirectory: string
): Promise<Module[]> {
  const entityType = entity.name;

  validateEntityName(entity);

  logger.info(`Creating ${entityType}...`);
  const entityName = camelCase(entityType);
  const resource = camelCase(plural(entityName));

  const serviceModules = await createServiceModules(
    entityName,
    entityType,
    entity,
    dtos,
    srcDirectory
  );

  const [serviceModule] = serviceModules;

  const controllerModules =
    (appInfo.settings.serverSettings.generateRestApi &&
      (await createControllerModules(
        resource,
        entityName,
        entityType,
        serviceModule.path,
        entity,
        srcDirectory
      ))) ||
    [];

  const [controllerModule, controllerBaseModule] = controllerModules;

  const resolverModules =
    (appInfo.settings.serverSettings.generateGraphQL &&
      (await createResolverModules(
        entityName,
        entityType,
        serviceModule.path,
        entity,
        dtos,
        srcDirectory
      ))) ||
    [];
  const [resolverModule] = resolverModules;

  const resourceModules = await createModules(
    entityName,
    entityType,
    serviceModule.path,
    controllerModule?.path,
    resolverModule?.path,
    srcDirectory
  );

  const testModule =
    controllerModule &&
    (await createControllerSpecModule(
      resource,
      entity,
      entityType,
      serviceModule.path,
      controllerModule.path,
      controllerBaseModule.path
    ));

  return [
    ...serviceModules,
    ...controllerModules,
    ...resolverModules,
    ...resourceModules,
    ...(testModule ? [testModule] : []),
  ];
}
