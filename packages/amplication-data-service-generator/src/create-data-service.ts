import path from "path";

import normalize from "normalize-path";
import winston from "winston";

import { createDTOs } from "./server/resource/create-dtos";
import { defaultLogger } from "./server/logging";
import {
  Entity,
  Role,
  AppInfo,
  Module,
  EnumDataType,
  LookupResolvedProperties,
  EntityField,
} from "./types";
import { createUserEntityIfNotExist } from "./server/user-entity";
import { createAdminModules } from "./admin/create-admin";
import { createServerModules } from "./server/create-server";
import { readStaticModules } from "./read-static-modules";
import { types } from "@amplication/data";

const STATIC_DIRECTORY = path.resolve(__dirname, "static");
const BASE_DIRECTORY = "";

export async function createDataService(
  entities: Entity[],
  roles: Role[],
  appInfo: AppInfo,
  logger: winston.Logger = defaultLogger
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
  const entityIdToEntity: Record<string, Entity> = {};
  const fieldIdToField: Record<string, EntityField> = {};
  for (const entity of entities) {
    entityIdToEntity[entity.id] = entity;
    for (const field of entity.fields) {
      fieldIdToField[field.id] = field;
    }
  }
  return entities.map((entity) => {
    return {
      ...entity,
      fields: entity.fields.map((field) => {
        if (field.dataType === EnumDataType.Lookup) {
          const {
            relatedEntityId,
            relatedFieldId,
          } = field.properties as types.Lookup;
          if (!relatedEntityId) {
            throw new Error(
              `Lookup entity field ${field.name} must have a relatedEntityId property with a valid entity ID`
            );
          }
          if (!relatedFieldId) {
            throw new Error(
              `Lookup entity field ${field.name} must have a relatedFieldId property with a valid entity ID`
            );
          }
          const relatedEntity = entityIdToEntity[relatedEntityId];
          const relatedField = fieldIdToField[relatedFieldId];
          if (!relatedEntity) {
            throw new Error(
              `Could not find entity with the ID ${relatedEntityId} referenced in entity field ${field.name}`
            );
          }
          if (!relatedField) {
            throw new Error(
              `Could not find entity field with the ID ${relatedFieldId} referenced in entity field ${field.name}`
            );
          }
          const properties: LookupResolvedProperties = {
            ...field.properties,
            relatedEntity,
            relatedField,
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
