import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { paramCase } from "param-case";
import flatten from "lodash.flatten";
import * as winston from "winston";
import { Entity, Module, AppInfo } from "../../types";
import { validateEntityName } from "../../util/entity";
import { DTOs } from "./create-dtos";
import { createServiceModules } from "./service/create-service";
import { createControllerModules } from "./controller/create-controller";
import { createModules } from "./module/create-module";
import { createControllerSpecModule } from "./test/create-controller-spec";
import { createResolverModules } from "./resolver/create-resolver";
import { IndexFileBuilder } from "../../util/indexFileBuilder";
import { SRC_DIRECTORY } from "../../server/constants";

export async function createResourcesModules(
  appInfo: AppInfo,
  entities: Entity[],
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  const resourceModuleLists = await Promise.all(
    entities.map((entity) =>
      createResourceModules(appInfo, entity, dtos, logger)
    )
  );
  const resourcesModules = flatten(resourceModuleLists);
  return resourcesModules;
}

async function createResourceModules(
  appInfo: AppInfo,
  entity: Entity,
  dtos: DTOs,
  logger: winston.Logger
): Promise<Module[]> {
  const entityType = entity.name;
  validateEntityName(entity);

  logger.info(`Creating ${entityType}...`);
  const entityName = camelCase(entityType);
  const resource = paramCase(plural(entityName));

  const baseFolderPath = `${SRC_DIRECTORY}/${entityName}/base`;

  const serviceModules = await createServiceModules(
    entityName,
    entityType,
    entity,
    dtos
  );

  const [serviceModule] = serviceModules;

  const controllerModules = await createControllerModules(
    appInfo,
    resource,
    entityName,
    entityType,
    serviceModule.path,
    entity,
    dtos
  );

  const [controllerModule, controllerBaseModule] = controllerModules;

  const resolverModules = await createResolverModules(
    entityName,
    entityType,
    serviceModule.path,
    entity,
    dtos
  );
  const [resolverModule] = resolverModules;

  const resourceModules = await createModules(
    entityName,
    entityType,
    serviceModule.path,
    controllerModule.path,
    resolverModule.path
  );

  const testModule = await createControllerSpecModule(
    resource,
    entity,
    entityType,
    serviceModule.path,
    controllerModule.path,
    controllerBaseModule.path
  );

  const baseModules = [
    ...serviceModules,
    ...controllerModules,
    ...resolverModules,
    ...resourceModules,
    testModule,
  ].filter((module) => module.path.includes("base")); //TODO implement base on regex
  const baseIndexFile = createBaseIndexFile(baseModules, baseFolderPath);

  return [
    ...serviceModules,
    ...controllerModules,
    ...resolverModules,
    ...resourceModules,
    testModule,
    baseIndexFile,
  ];
}

function createBaseIndexFile(files: Module[], baseFolderPath: string): Module {
  const indexBuilder = new IndexFileBuilder(baseFolderPath);
  files.forEach((file) => {
    indexBuilder.addFile(file.path);
  });
  return indexBuilder.build();
}
