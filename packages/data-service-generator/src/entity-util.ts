import {
  Entity,
  entityDefaultActions,
  EnumModuleActionType,
} from "@amplication/code-gen-types";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import pluralize from "pluralize";

//This file is a copy of the file from the @amplication/dsg-util package
//due to constraints in nx, we cannot import it from the package, so we copied it here
//todo: remove this file once the constraints are removed

//returns the plural name of the entity, based on its name, in a camelCase format
//in case the plural name is the same as the name, it adds the suffix "Items"
export const prepareEntityPluralName = (entityName: string): string => {
  let pluralName = pluralize(camelCase(entityName));

  pluralName =
    pluralName === camelCase(entityName) ? `${pluralName}Items` : pluralName;
  return pluralName;
};

export const getDefaultActionsForEntity = (
  entity: Entity
): entityDefaultActions => {
  const entityPluralName = pascalCase(prepareEntityPluralName(entity.name));
  const entityName = entity.name;

  const entityDisplayName = entity.displayName;
  const entityPluralDisplayName = entity.pluralDisplayName;

  return {
    [EnumModuleActionType.Meta]: {
      actionType: EnumModuleActionType.Meta,
      name: `_${entityPluralName}Meta`,
      displayName: `${entityPluralDisplayName} Meta`,
      description: `Meta data about ${entityDisplayName} records`,
      enabled: true,
      isDefault: true,
    },
    [EnumModuleActionType.Create]: {
      actionType: EnumModuleActionType.Create,
      name: `create${entityName}`,
      displayName: `Create ${entityDisplayName}`,
      description: `Create one ${entityDisplayName}`,
      enabled: true,
      isDefault: true,
    },
    [EnumModuleActionType.Read]: {
      actionType: EnumModuleActionType.Read,
      name: `${entityName}`,
      displayName: `Get ${entityDisplayName}`,
      description: `Get one ${entityDisplayName}`,
      enabled: true,
      isDefault: true,
    },
    [EnumModuleActionType.Update]: {
      actionType: EnumModuleActionType.Update,
      name: `update${entityName}`,
      displayName: `Update ${entityDisplayName}`,
      description: `Update one ${entityDisplayName}`,
      enabled: true,
      isDefault: true,
    },
    [EnumModuleActionType.Delete]: {
      actionType: EnumModuleActionType.Delete,
      name: `delete${entityName}`,
      displayName: `Delete ${entityDisplayName}`,
      description: `Delete one ${entityDisplayName}`,
      enabled: true,
      isDefault: true,
    },
    [EnumModuleActionType.Find]: {
      actionType: EnumModuleActionType.Find,
      name: `${entityPluralName}`,
      displayName: `Find ${entityPluralDisplayName}`,
      description: `Find many ${entityPluralDisplayName}`,
      enabled: true,
      isDefault: true,
    },
  };
};
