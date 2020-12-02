import normalize from "normalize-path";

import winston from "winston";

import { Module } from "./util/module";
import { getEntityIdToName } from "./util/entity";
import { createDTOs } from "./resource/create-dtos";
import { defaultLogger } from "./logging";
import { Entity, Role, AppInfo } from "./types";
import { createUserEntityIfNotExist } from "./user-entity";
import { createAdminModules } from "./admin/create-admin";
import { createServerModules } from "./create-server";

export async function createDataService(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  logger: winston.Logger = defaultLogger
): Promise<Module[]> {
  logger.info("Creating application...");
  const timer = logger.startTimer();

  const [normalizedEntities, userEntity] = createUserEntityIfNotExist(entities);

  const entityIdToName = getEntityIdToName(normalizedEntities);

  logger.info("Creating DTOs...");
  const dtos = createDTOs(normalizedEntities, entityIdToName);

  const modules = (
    await Promise.all([
      createServerModules(
        normalizedEntities,
        roles,
        appInfo,
        entityIdToName,
        dtos,
        userEntity,
        logger
      ),
      createAdminModules(normalizedEntities, roles, appInfo, dtos, logger),
    ])
  ).flat();

  timer.done({ message: "Application creation time" });

  /** @todo make module paths to always use Unix path separator */
  return modules.map((module) => ({
    ...module,
    path: normalize(module.path),
  }));
}
