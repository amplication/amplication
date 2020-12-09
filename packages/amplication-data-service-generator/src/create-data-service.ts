import path from "path";

import normalize from "normalize-path";
import winston from "winston";

import { getEntityIdToName } from "./util/entity";
import { createDTOs } from "./server/resource/create-dtos";
import { defaultLogger } from "./server/logging";
import { Entity, Role, AppInfo, Module } from "./types";
import { createUserEntityIfNotExist } from "./server/user-entity";
import { createAdminModules } from "./admin/create-admin";
import { createServerModules } from "./server/create-server";
import { readStaticModules } from "./read-static-modules";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");
const BASE_DIRECTORY = "";

export async function createDataService(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  createAdmin = true,
  logger: winston.Logger = defaultLogger
): Promise<Module[]> {
  logger.info("Creating application...");
  const timer = logger.startTimer();

  const [normalizedEntities, userEntity] = createUserEntityIfNotExist(entities);

  const entityIdToName = getEntityIdToName(normalizedEntities);

  logger.info("Creating DTOs...");
  const dtos = createDTOs(normalizedEntities, entityIdToName);

  logger.info("Copying static modules...");
  const staticModulesPromise = readStaticModules(
    STATIC_DIRECTORY,
    BASE_DIRECTORY
  );

  const serverModulesPromise = createServerModules(
    normalizedEntities,
    roles,
    appInfo,
    entityIdToName,
    dtos,
    userEntity,
    logger
  );
  const modulePromises = createAdmin
    ? [
        staticModulesPromise,
        serverModulesPromise,
        createAdminModules(
          normalizedEntities,
          roles,
          appInfo,
          dtos,
          entityIdToName,
          logger
        ),
      ]
    : [staticModulesPromise, serverModulesPromise];
  const modules = (await Promise.all(modulePromises)).flat();

  timer.done({ message: "Application creation time" });

  /** @todo make module paths to always use Unix path separator */
  return modules.map((module) => ({
    ...module,
    path: normalize(module.path),
  }));
}
