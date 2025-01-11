import {
  DSGResourceData,
  Entity,
  EntityActionsMap,
  EntityField,
  EnumDataType,
  EnumModuleActionType,
  LookupResolvedProperties,
  ModuleAction,
  ModuleActionsAndDtosMap,
  ModuleActionsAndDtos,
  ModuleContainer,
  ModuleDto,
  PluginInstallation,
  entityDefaultActions,
  entityRelatedFieldDefaultActions,
  serverDirectories,
  types,
  EnumModuleDtoPropertyType,
  PropertyTypeDef,
} from "@amplication/code-gen-types";
import {
  getDefaultActionsForEntity,
  getDefaultActionsForRelationField,
} from "@amplication/dsg-utils";
import { ILogger } from "@amplication/util-logging";
import { camelCase } from "camel-case";
import { get, isEmpty, trim } from "lodash";
import { join } from "path";
import pluralize from "pluralize";
import DsgContext from "./dsg-context";
import { EnumResourceType } from "./models";
import registerPlugins from "./register-plugin";

import { resolveMessageBrokerTopicNames } from "@amplication/dsg-utils";
import { EnumModuleDtoDecoratorType } from "@amplication/code-gen-types";
import { pascalCase } from "pascal-case";

const BLUEPRINT_BASE_DIRECTORY = "./";

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
    moduleActions,
    moduleContainers,
    moduleDtos,
    resourceSettings,
    relations,
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
  context.moduleContainers = moduleContainers;
  context.moduleActions = moduleActions;
  context.moduleDtos = moduleDtos;
  context.resourceSettings = resourceSettings;
  context.relations = relations;

  context.moduleActionsAndDtoMap = prepareModuleActionsAndDtos(
    moduleContainers,
    moduleActions,
    moduleDtos,
    context.appInfo.settings?.serverSettings?.generateGraphQL || false
  );

  context.entityActionsMap = prepareEntityActions(
    entities,
    moduleContainers,
    moduleActions
  );
  context.generateGrpc = shouldGenerateGrpc(context.pluginInstallations);

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

  context.plugins = plugins;
}

function validatePath(path: string): string | null {
  return path.trim() || null;
}

function dynamicServerPathCreator(serverPath: string): serverDirectories {
  const baseDirectory = validatePath(serverPath) || BLUEPRINT_BASE_DIRECTORY;
  const srcDirectory = `${baseDirectory}/src`;
  return {
    baseDirectory: baseDirectory,
    srcDirectory: srcDirectory,
    scriptsDirectory: `${baseDirectory}/scripts`,
    authDirectory: `${srcDirectory}/auth`,
    messageBrokerDirectory: join(srcDirectory, "message-broker"),
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

export function shouldGenerateGrpc(
  pluginInstallations: PluginInstallation[]
): boolean {
  return (
    pluginInstallations.filter(
      (p) => p.configurations && p.configurations["generateGRPC"] === "true"
    ).length > 0
  );
}

function prepareServiceTopics(dSGResourceData: DSGResourceData) {
  return resolveMessageBrokerTopicNames(
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

function prepareEntityActions(
  entities: Entity[],
  moduleContainers: ModuleContainer[],
  moduleActions: ModuleAction[]
): EntityActionsMap {
  return Object.fromEntries(
    entities.map((entity) => {
      const defaultActions = getDefaultActionsForEntity(entity);

      const relationFields = entity.fields.filter((field) => {
        return field.dataType === EnumDataType.Lookup;
      });

      const defaultRelatedActions = Object.fromEntries(
        relationFields.map((relatedField) => {
          return [
            relatedField.name,
            getDefaultActionsForRelationField(entity, relatedField),
          ];
        })
      );

      const moduleContainer = moduleContainers?.find(
        (moduleContainer) => moduleContainer.entityId === entity.id
      );

      //return the defaultActions if the relevant module was not provided
      if (moduleContainer === undefined) {
        return [
          entity.name,
          {
            entityDefaultActions: defaultActions,
            relatedFieldsDefaultActions: defaultRelatedActions,
            customActions: [],
          },
        ];
      }

      const moduleContainerId = moduleContainer.id;

      const actionKeys = Object.keys(EnumModuleActionType) as Array<
        keyof typeof EnumModuleActionType
      >;

      const currentEntityActions = moduleActions.filter(
        (moduleAction) => moduleAction.parentBlockId === moduleContainerId
      );

      let entityCustomAction = currentEntityActions.filter(
        (moduleAction) =>
          moduleAction.actionType === EnumModuleActionType.Custom
      );

      //create 2 arrays for default and relations
      let entityDefaultEntries = Object.fromEntries(
        actionKeys
          .map((key) => {
            if (key === EnumModuleActionType.Custom) {
              return undefined;
            }
            const moduleAction = currentEntityActions.find(
              (moduleAction) =>
                moduleAction.actionType === key &&
                !moduleAction.fieldPermanentId
            );
            const action = moduleAction || defaultActions[key];
            //return the defaultAction if the relevant actions was not provided
            return action ? [key, action] : undefined;
          })
          .filter((entry) => entry !== undefined) //only keep the entries that are not undefined
      ) as entityDefaultActions;

      let relatedFieldsDefaultEntries = Object.fromEntries(
        relationFields.map((relatedField) => {
          const actions = actionKeys.map((key) => {
            const moduleAction = currentEntityActions.find(
              (moduleAction) =>
                moduleAction.actionType === key &&
                moduleAction.fieldPermanentId === relatedField.permanentId
            );

            //return the defaultAction if the relevant actions was not provided
            return moduleAction || defaultRelatedActions[key] || undefined;
          });

          const actionsMap = Object.fromEntries(
            actions
              .filter((action) => !!action) //only keep the entries that are not undefined
              .map((action: ModuleAction) => {
                return [action.actionType, action];
              })
          );
          return [relatedField.name, actionsMap];
        })
      ) as Record<string, entityRelatedFieldDefaultActions>;

      //disable all actions if the moduleContainer is disabled
      if (!moduleContainer.enabled) {
        entityDefaultEntries = Object.fromEntries(
          Object.entries(entityDefaultEntries).map(([key, value]) => {
            return [key, { ...value, enabled: false }];
          })
        ) as entityDefaultActions;

        relatedFieldsDefaultEntries = Object.fromEntries(
          Object.entries(relatedFieldsDefaultEntries).map(([key, value]) => {
            return [
              key,
              Object.fromEntries(
                Object.entries(value).map(([key, value]) => {
                  return [key, { ...value, enabled: false }];
                })
              ),
            ];
          })
        );

        entityCustomAction = entityCustomAction.map((action) => {
          return { ...action, enabled: false };
        });
      }

      return [
        entity.name,
        {
          entityDefaultActions: entityDefaultEntries,
          relatedFieldsDefaultActions: relatedFieldsDefaultEntries,
          customActions: entityCustomAction,
        },
      ];
    })
  );
}

function prepareModuleActionsAndDtos(
  moduleContainers: ModuleContainer[],
  moduleActions: ModuleAction[],
  moduleDtos: ModuleDto[],
  generateGraphQL: boolean
): ModuleActionsAndDtosMap {
  const dtosMap = Object.fromEntries(
    moduleDtos.map((moduleDto) => {
      return [moduleDto.id, moduleDto];
    })
  );

  //resolve references from dto properties to dtos
  moduleDtos.forEach((moduleDto) => {
    const dtoProperties = moduleDto.properties;
    if (dtoProperties) {
      dtoProperties.forEach((property) => {
        const propertyTypes = property.propertyTypes;
        if (propertyTypes) {
          propertyTypes.forEach((propertyType) => {
            resolvePropTypeDtoFromDtoId(
              propertyType,
              dtosMap,
              `dto property ${property.name} of moduleDto ${moduleDto.name}`
            );
          });
        }
      });
    }
  });

  //resolve references from action input/output types to dtos
  moduleActions.forEach((moduleAction) => {
    if (!moduleAction.restInputSource) {
      moduleAction.restInputSource = "Body"; //set the default as Body in case no value was provided
    }

    moduleAction.name = pascalCase(moduleAction.name);

    const actionInputType = moduleAction.inputType;
    if (actionInputType) {
      if (
        resolvePropTypeDtoFromDtoId(
          actionInputType,
          dtosMap,
          `action ${moduleAction.name} input type`
        )
      ) {
        if (generateGraphQL) {
          addDecoratorToDto(
            actionInputType.dto,
            EnumModuleDtoDecoratorType.ArgsType
          );
          setDtoNestedDecorator(
            actionInputType.dto,
            EnumModuleDtoDecoratorType.InputType,
            dtosMap,
            true // the top level DTO has ArgsType and doesn't also need InputType
          );
        }
      }
    }

    const actionOutputType = moduleAction.outputType;
    if (actionOutputType) {
      if (
        resolvePropTypeDtoFromDtoId(
          actionOutputType,
          dtosMap,
          `action ${moduleAction.name} output type`
        )
      ) {
        if (generateGraphQL) {
          setDtoNestedDecorator(
            actionOutputType.dto,
            EnumModuleDtoDecoratorType.ObjectType,
            dtosMap
          );
        }
      }
    }
  });

  return Object.fromEntries(
    moduleContainers.map((moduleContainer) => {
      const moduleContainerId = moduleContainer.id;

      const currentModuleActions = moduleActions?.filter(
        (moduleAction) => moduleAction.parentBlockId === moduleContainerId
      );

      const currentModuleDtos = moduleDtos?.filter(
        (moduleDto) => moduleDto.parentBlockId === moduleContainerId
      );

      const moduleActionsAndDtos: ModuleActionsAndDtos = {
        moduleContainer: moduleContainer,
        actions: currentModuleActions,
        dtos: currentModuleDtos,
      };

      return [moduleContainer.name, moduleActionsAndDtos];
    })
  );
}

function setDtoNestedDecorator(
  dto: ModuleDto,
  decorator: EnumModuleDtoDecoratorType,
  dtosMap: { [k: string]: ModuleDto },
  decorateOnlySubProperties = false
) {
  if (dto.decorators && dto.decorators.find((dec) => dec === decorator)) return;

  if (!decorateOnlySubProperties) {
    addDecoratorToDto(dto, decorator);
  }

  if (dto.properties) {
    dto.properties.forEach((prop) => {
      if (prop.propertyTypes) {
        prop.propertyTypes.forEach((propType) => {
          if (propType.type === EnumModuleDtoPropertyType.Dto) {
            if (
              resolvePropTypeDtoFromDtoId(
                propType,
                dtosMap,
                `DTO ${dto.name} in property ${prop.name}`
              )
            ) {
              setDtoNestedDecorator(propType.dto, decorator, dtosMap);
            }
          }
        });
      }
    });
  }
}

function addDecoratorToDto(
  dto: ModuleDto,
  decorator: EnumModuleDtoDecoratorType
) {
  if (!dto.decorators) dto.decorators = [];
  dto.decorators.push(decorator);
}

function resolvePropTypeDtoFromDtoId(
  propertyType: PropertyTypeDef,
  dtosMap: { [k: string]: ModuleDto },
  referencedIn: string
): boolean {
  const dtoId = propertyType.dtoId;
  if (dtoId) {
    const dto = dtosMap[dtoId];
    if (dto) {
      propertyType.dto = dto;
      return true;
    } else {
      throw new Error(
        `Could not find dto with the ID ${dtoId} referenced in ${referencedIn}`
      );
    }
  }
  return false;
}
