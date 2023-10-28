import {
  Entity,
  entityDefaultActions,
  EntityField,
  entityRelatedFieldDefaultActions,
  EnumModuleActionType,
  types,
} from "@amplication/code-gen-types";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import pluralize from "pluralize";

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
    },
    [EnumModuleActionType.Create]: {
      actionType: EnumModuleActionType.Create,
      name: `create${entityName}`,
      displayName: `Create ${entityDisplayName}`,
      description: `Create one ${entityDisplayName}`,
      enabled: true,
    },
    [EnumModuleActionType.Read]: {
      actionType: EnumModuleActionType.Read,
      name: `${entityName}`,
      displayName: `Get ${entityDisplayName}`,
      description: `Get one ${entityDisplayName}`,
      enabled: true,
    },
    [EnumModuleActionType.Update]: {
      actionType: EnumModuleActionType.Update,
      name: `update${entityName}`,
      displayName: `Update ${entityDisplayName}`,
      description: `Update one ${entityDisplayName}`,
      enabled: true,
    },
    [EnumModuleActionType.Delete]: {
      actionType: EnumModuleActionType.Delete,
      name: `delete${entityName}`,
      displayName: `Delete ${entityDisplayName}`,
      description: `Delete one ${entityDisplayName}`,
      enabled: true,
    },
    [EnumModuleActionType.Find]: {
      actionType: EnumModuleActionType.Find,
      name: `${entityPluralName}`,
      displayName: `Find ${entityPluralDisplayName}`,
      description: `Find many ${entityPluralDisplayName}`,
      enabled: true,
    },
  };
};

export const getDefaultActionsForRelationField = (
  entity: Entity,
  relatedField: EntityField
): entityRelatedFieldDefaultActions => {
  const fieldName = pascalCase(relatedField.name);
  const fieldDisplayName = relatedField.displayName;
  const entityDisplayName = entity.displayName;

  const isToMany = (relatedField.properties as unknown as types.Lookup)
    .allowMultipleSelection;

  if (isToMany) {
    return {
      [EnumModuleActionType.ChildrenConnect]: {
        actionType: EnumModuleActionType.ChildrenConnect,
        name: `connect${fieldName}`,
        displayName: `${entityDisplayName} Connect ${fieldDisplayName}`,
        description: `Connect multiple ${fieldDisplayName} records to ${entityDisplayName}`,
        enabled: true,
      },
      [EnumModuleActionType.ChildrenDisconnect]: {
        actionType: EnumModuleActionType.ChildrenDisconnect,
        name: `disconnect${fieldName}`,
        displayName: `${entityDisplayName} Disconnect ${fieldDisplayName}`,
        description: `Disconnect multiple ${fieldDisplayName} records from ${entityDisplayName}`,
        enabled: true,
      },
      [EnumModuleActionType.ChildrenFind]: {
        actionType: EnumModuleActionType.ChildrenFind,
        name: `find${fieldName}`,
        displayName: `${entityDisplayName} Find ${fieldDisplayName}`,
        description: `Find multiple ${fieldDisplayName} records for ${entityDisplayName}`,
        enabled: true,
      },
      [EnumModuleActionType.ChildrenUpdate]: {
        actionType: EnumModuleActionType.ChildrenUpdate,
        name: `update${fieldName}`,
        displayName: `${entityDisplayName} Update ${fieldDisplayName}`,
        description: `Update multiple ${fieldDisplayName} records for ${entityDisplayName}`,
        enabled: true,
      },
    };
  } else {
    return {
      [EnumModuleActionType.ParentGet]: {
        actionType: EnumModuleActionType.ParentGet,
        name: `get${fieldName}`,
        displayName: `${entityDisplayName} Get ${fieldDisplayName}`,
        description: `Get a ${fieldDisplayName} record for ${entityDisplayName}`,
        enabled: true,
      },
    };
  }
};
