import {
  clientDirectories,
  DSGResourceData,
  Entity,
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
  serverDirectories,
  types,
} from "@amplication/code-gen-types";
import { ILogger } from "@amplication/util/logging";
import { camelCase } from "camel-case";
import { get, isEmpty, trim } from "lodash";
import { join } from "path";
import pluralize from "pluralize";
import { CLIENT_BASE_DIRECTORY } from "./admin/constants";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import registerPlugins from "./register-plugin";
import { SERVER_BASE_DIRECTORY } from "./server/constants";
import { resolveTopicNames } from "./utils/message-broker";

//This function runs at the start of the process, to prepare the input data, and populate the context object
export async function prepareContext(
  dSGResourceData: DSGResourceData,
  internalLogger: ILogger,
  pluginInstallationPath?: string
): Promise<void> {
  internalLogger.info("Preparing context...");

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

  const plugins = await registerPlugins(
    resourcePlugins,
    pluginInstallationPath
  );

  const entitiesWithPluralName = prepareEntityPluralName(entities);

  const normalizedEntities = resolveLookupFields(entitiesWithPluralName);

  const serviceTopicsWithName = prepareServiceTopics(dSGResourceData);

  const context = DsgContext.getInstance;
  context.appInfo = appInfo;
  context.roles = roles;
  context.entities = normalizedEntities;
  context.serviceTopics = serviceTopicsWithName;
  context.otherResources = otherResources;
  context.pluginInstallations = resourcePlugins;

  context.hasDecimalFields = normalizedEntities.some((entity) => {
    return entity.fields.some(
      (field) =>
        field.dataType === EnumDataType.DecimalNumber &&
        (field.properties as types.DecimalNumber)?.databaseFieldType ===
          "DECIMAL"
    );
  });

  context.hasBigIntFields = normalizedEntities.some((entity) => {
    return entity.fields.some(
      (field) =>
        field.dataType === EnumDataType.WholeNumber &&
        (field.properties as types.WholeNumber)?.databaseFieldType === "BIG_INT"
    );
  });

  context.serverDirectories = dynamicServerPathCreator(
    get(appInfo, "settings.serverSettings.serverPath", "")
  );
  context.clientDirectories = dynamicClientPathCreator(
    get(appInfo, "settings.adminUISettings.adminUIPath", "")
  );

  context.plugins = plugins;
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

export function prepareEntityPluralName(entities: Entity[]): Entity[] {
  const currentEntities = entities.map((entity) => {
    entity.pluralName = pluralize(camelCase(entity.name));
    entity.pluralName =
      entity.pluralName === camelCase(entity.name)
        ? `${entity.pluralName}Items`
        : entity.pluralName;
    return entity;
  });
  return currentEntities;
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

          const { relatedEntityId, relatedFieldId, fkFieldName } =
            fieldProperties;
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

          let isOneToOneWithoutForeignKey = true;

          if (fieldProperties.fkHolder) {
            isOneToOneWithoutForeignKey =
              isOneToOne && field.permanentId !== fieldProperties.fkHolder;
          } else {
            isOneToOneWithoutForeignKey =
              isOneToOne && field.permanentId > relatedField.permanentId;
          }

          const properties: LookupResolvedProperties = {
            ...field.properties,
            relatedEntity,
            relatedField,
            isOneToOneWithoutForeignKey,
            fkFieldName: !isEmpty(trim(fkFieldName))
              ? fkFieldName
              : `${field.name}Id`,
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
