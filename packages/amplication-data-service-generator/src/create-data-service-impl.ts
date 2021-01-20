import path from "path";

import normalize from "normalize-path";
import winston from "winston";

import { createDTOs } from "./server/resource/create-dtos";
import {
  Entity,
  Role,
  AppInfo,
  Module,
  EnumDataType,
  LookupResolvedProperties,
} from "./types";
import { createUserEntityIfNotExist } from "./server/user-entity";
import { createAdminModules } from "./admin/create-admin";
import { createServerModules } from "./server/create-server";
import { readStaticModules } from "./read-static-modules";
import { types } from "@amplication/data";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");
const BASE_DIRECTORY = "";

export async function createDataServiceImpl(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  logger: winston.Logger
): Promise<Module[]> {
  logger.info("Creating application...");
  const timer = logger.startTimer();

  const [entitiesWithUserEntity, userEntity] = createUserEntityIfNotExist(
    entities
  );
  const normalizedEntities = resolveLookupFields(entitiesWithUserEntity);

  logger.info("Creating DTOs...");
  const dtos = await createDTOs(normalizedEntities);

  logger.info("Copying static modules...");

  const modules = (
    await Promise.all([
      readStaticModules(STATIC_DIRECTORY, BASE_DIRECTORY),
      createServerModules(
        normalizedEntities,
        roles,
        appInfo,
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

function resolveLookupFields(entities: Entity[]): Entity[] {
  const entityIdToEntity = Object.fromEntries(
    entities.map((entity) => [entity.id, entity])
  );
  return entities.map((entity) => {
    return {
      ...entity,
      fields: entity.fields.map((field) => {
        if (field.dataType === EnumDataType.Lookup) {
          const { relatedEntityId } = field.properties as types.Lookup;
          const relatedEntity = entityIdToEntity[relatedEntityId];
          if (!relatedEntity) {
            throw new Error(
              `Could not find entity with the ID ${relatedEntityId} referenced in field ${field.name}`
            );
          }
          const properties: LookupResolvedProperties = {
            ...field.properties,
            relatedEntity,
          };
          return {
            ...field,
            properties,
          };
        }
        return field;
      }),
    };
  });
}
