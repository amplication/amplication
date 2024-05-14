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
import { createGrpcControllerModules } from "./grpc-controller/create-grpc-controller";

export async function createResourcesModules(
  entities: Entity[],
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const resourceModules = new ModuleMap(DsgContext.getInstance.logger);
  for await (const entity of entities) {
    await resourceModules.merge(
      await createResourceModules(entity, dtoNameToPath)
    );
  }

  return resourceModules;
}

async function createResourceModules(
  entity: Entity,
  dtoNameToPath: Record<string, string>
): Promise<ModuleMap> {
  const entityType = entity.name;
  const context = DsgContext.getInstance;
  const { appInfo, generateGrpc } = context;

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
    delegateId,
    dtoNameToPath
  );

  const [serviceModule] = serviceModules.modules();

  const controllerModules =
    (appInfo.settings.serverSettings.generateRestApi &&
      (await createControllerModules(
        resource,
        entityName,
        entityType,
        serviceModule.path,
        entity,
        dtoNameToPath
      ))) ||
    new ModuleMap(DsgContext.getInstance.logger);

  const [controllerModule, controllerBaseModule] = controllerModules.modules();

  const grpcControllerModules =
    (generateGrpc &&
      (await createGrpcControllerModules(
        resource,
        entityName,
        entityType,
        serviceModule.path,
        entity,
        dtoNameToPath
      ))) ||
    new ModuleMap(DsgContext.getInstance.logger);

  const [grpcControllerModule] = grpcControllerModules.modules();

  const resolverModules =
    (appInfo.settings.serverSettings.generateGraphQL &&
      (await createResolverModules(
        entityName,
        entityType,
        serviceModule.path,
        entity,
        dtoNameToPath
      ))) ||
    new ModuleMap(DsgContext.getInstance.logger);
  const [resolverModule] = resolverModules.modules();

  const resourceModules = await createModules(
    entityName,
    entityType,
    serviceModule.path,
    controllerModule?.path,
    grpcControllerModule?.path,
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
    new ModuleMap(DsgContext.getInstance.logger);

  const moduleMap = new ModuleMap(context.logger);
  await moduleMap.mergeMany([
    serviceModules,
    controllerModules,
    grpcControllerModules,
    resolverModules,
    resourceModules,
    testModule,
  ]);

  return moduleMap;
}
