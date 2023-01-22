import {
  clientDirectories,
  DSGResourceData,
  Entity,
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
  Module,
  PluginInstallation,
  serverDirectories,
  types,
} from "@amplication/code-gen-types";
import { camelCase } from "camel-case";
import { get } from "lodash";
import { join } from "path";
import pluralize from "pluralize";
import winston from "winston";
import { CLIENT_BASE_DIRECTORY } from "./admin/constants";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import registerPlugins from "./register-plugin";
import { SERVER_BASE_DIRECTORY } from "./server/constants";
import { createUserEntityIfNotExist } from "./server/user-entity/user-entity";
import { resolveTopicNames } from "./util/message-broker";

export const POSTGRESQL_PLUGIN_ID = "db-postgres";
export const MYSQL_PLUGIN_ID = "db-mysql";
export const POSTGRESQL_NPM = "@amplication/plugin-db-postgres";

const defaultPlugins: {
  categoryPluginIds: string[];
  defaultCategoryPlugin: PluginInstallation;
}[] = [
  {
    categoryPluginIds: [POSTGRESQL_PLUGIN_ID, MYSQL_PLUGIN_ID],
    defaultCategoryPlugin: {
      id: "placeholder-id",
      pluginId: POSTGRESQL_PLUGIN_ID,
      npm: POSTGRESQL_NPM,
      enabled: true,
      version: "latest",
    },
  },
];

//This function runs at the start of the process, to prepare the input data, and populate the context object
export async function prepareContext(
  dSGResourceData: DSGResourceData,
  logger: winston.Logger,
  pluginInstallationPath?: string
): Promise<Module[]> {
  logger.info("Preparing context...");

  const {
    pluginInstallations: resourcePlugins,
    entities,
    roles,
    resourceInfo: appInfo,
    otherResources,
  } = dSGResourceData;

  if (!entities || !roles || !appInfo) {
    throw new Error("Missing required data");
  }

  const pluginsWithDefaultPlugins = prepareDefaultPlugins(resourcePlugins);
  const plugins = await registerPlugins(
    pluginsWithDefaultPlugins,
    pluginInstallationPath
  );

  const [entitiesWithUserEntity] = createUserEntityIfNotExist(entities);

  const entitiesWithPluralName = prepareEntityPluralName(
    entitiesWithUserEntity
  );

  const normalizedEntities = resolveLookupFields(entitiesWithPluralName);

  const serviceTopicsWithName = prepareServiceTopics(dSGResourceData);

  const context = DsgContext.getInstance;
  context.logger = logger;
  context.appInfo = appInfo;
  context.roles = roles;
  context.entities = normalizedEntities;
  context.serviceTopics = serviceTopicsWithName;
  context.otherResources = otherResources;

  context.serverDirectories = dynamicServerPathCreator(
    get(appInfo, "settings.serverSettings.serverPath", "")
  );
  context.clientDirectories = dynamicClientPathCreator(
    get(appInfo, "settings.adminUISettings.adminUIPath", "")
  );

  context.plugins = plugins;
  return [];
}

function validatePath(path: string): string | null {
  return path.trim() || null;
}

function dynamicServerPathCreator(serverPath: string): serverDirectories {
  const baseDirectory = validatePath(serverPath) || SERVER_BASE_DIRECTORY;
  const srcDirectory = `${baseDirectory}/src`;
  return {
    baseDirectory: baseDirectory,
    srcDirectory: srcDirectory,
    scriptsDirectory: `${baseDirectory}/scripts`,
    authDirectory: `${srcDirectory}/auth`,
    messageBrokerDirectory: join(srcDirectory, "message-broker"),
  };
}

function dynamicClientPathCreator(clientPath: string): clientDirectories {
  const baseDirectory = validatePath(clientPath) || CLIENT_BASE_DIRECTORY;
  const srcDirectory = `${baseDirectory}/src`;
  return {
    baseDirectory: baseDirectory,
    srcDirectory: srcDirectory,
    publicDirectory: `${baseDirectory}/public`,
    apiDirectory: `${srcDirectory}/api`,
    authDirectory: `${srcDirectory}/auth-provider`,
  };
}

function prepareEntityPluralName(entities: Entity[]): Entity[] {
  const currentEntities = entities.map((entity) => {
    entity.pluralName = pluralize(camelCase(entity.name));
    return entity;
  });
  return currentEntities;
}

function prepareDefaultPlugins(
  installedPlugins: PluginInstallation[]
): PluginInstallation[] {
  const missingDefaultPlugins = defaultPlugins.flatMap((pluginCategory) => {
    let pluginFound = false;
    pluginCategory.categoryPluginIds.forEach((pluginId) => {
      if (!pluginFound) {
        pluginFound = installedPlugins.some(
          (installedPlugin) => installedPlugin.pluginId === pluginId
        );
      }
    });
    if (!pluginFound) return [pluginCategory.defaultCategoryPlugin];

    return [];
  });
  return [...missingDefaultPlugins, ...installedPlugins];
}

function prepareServiceTopics(dSGResourceData: DSGResourceData) {
  return resolveTopicNames(
    dSGResourceData.serviceTopics || [],
    dSGResourceData.otherResources?.filter(
      (resource) => resource.resourceType === EnumResourceType.MessageBroker
    ) || []
  );
}

function resolveLookupFields(entities: Entity[]): Entity[] {
  const entityIdToEntity: Record<string, Entity> = {};
  const fieldIdToField: Record<string, EntityField> = {};
  for (const entity of entities) {
    entityIdToEntity[entity.id] = entity;
    for (const field of entity.fields) {
      fieldIdToField[field.permanentId] = field;
    }
  }
  return entities.map((entity) => {
    return {
      ...entity,
      fields: entity.fields.map((field) => {
        if (field.dataType === EnumDataType.Lookup) {
          const fieldProperties = field.properties as types.Lookup;

          const { relatedEntityId, relatedFieldId } = fieldProperties;
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

          const relatedFieldProperties =
            relatedField.properties as types.Lookup;

          const isOneToOne =
            !fieldProperties.allowMultipleSelection &&
            !relatedFieldProperties.allowMultipleSelection;

          const isOneToOneWithoutForeignKey =
            (isOneToOne && field.permanentId !== fieldProperties.FkHolder) ||
            (isOneToOne && field.permanentId > relatedField.permanentId);

          const properties: LookupResolvedProperties = {
            ...field.properties,
            relatedEntity,
            relatedField,
            isOneToOneWithoutForeignKey,
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
