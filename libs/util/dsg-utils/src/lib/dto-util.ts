import {
  Entity,
  EntityField,
  EnumModuleDtoType,
  ModuleDto,
  entityDefaultDtos,
  entityDefaultNestedDtos,
} from "@amplication/code-gen-types";
import { pascalCase } from "pascal-case";
import { prepareEntityPluralName } from "./entity-util";

export const getDefaultDtosForEntity = (entity: Entity): entityDefaultDtos => {
  const entityName = entity.name;
  const entityDisplayName = entity.displayName;

  return {
    [EnumModuleDtoType.Entity]: {
      dtoType: EnumModuleDtoType.Entity,
      name: entityName,
      description: `the ${entityDisplayName} model`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.CountArgs]: {
      dtoType: EnumModuleDtoType.CountArgs,
      name: `${entityName}CountArgs`,
      description: `Input type for ${entityDisplayName} count`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.CreateArgs]: {
      dtoType: EnumModuleDtoType.CreateArgs,
      name: `Create${entityName}Args`,
      description: `Args type for ${entityDisplayName} creation`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.CreateInput]: {
      dtoType: EnumModuleDtoType.CreateInput,
      name: `${entityName}CreateInput`,
      description: `Input type for ${entityDisplayName} creation`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.DeleteArgs]: {
      dtoType: EnumModuleDtoType.DeleteArgs,
      name: `Delete${entityName}Args`,
      description: `Args type for ${entityDisplayName} deletion`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.FindManyArgs]: {
      dtoType: EnumModuleDtoType.FindManyArgs,
      name: `${entityName}FindManyArgs`,
      description: `Args type for ${entityDisplayName} search`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.FindOneArgs]: {
      dtoType: EnumModuleDtoType.FindOneArgs,
      name: `${entityName}FindUniqueArgs`,
      description: `Args type for ${entityDisplayName} retrieval`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.ListRelationFilter]: {
      dtoType: EnumModuleDtoType.ListRelationFilter,
      name: `${entityName}ListRelationFilter`,
      description: `Input type for ${entityDisplayName} relation filter`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.OrderByInput]: {
      dtoType: EnumModuleDtoType.OrderByInput,
      name: `${entityName}OrderByInput`,
      description: `Input type for ${entityDisplayName} sorting`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.UpdateArgs]: {
      dtoType: EnumModuleDtoType.UpdateArgs,
      name: `Update${entityName}Args`,
      description: `Args type for ${entityDisplayName} update`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.UpdateInput]: {
      dtoType: EnumModuleDtoType.UpdateInput,
      name: `${entityName}UpdateInput`,
      description: `Input type for ${entityDisplayName} update`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.WhereInput]: {
      dtoType: EnumModuleDtoType.WhereInput,
      name: `${entityName}WhereInput`,
      description: `Input type for ${entityDisplayName} search`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.WhereUniqueInput]: {
      dtoType: EnumModuleDtoType.WhereUniqueInput,
      name: `${entityName}WhereUniqueInput`,
      description: `Input type for ${entityDisplayName} retrieval`,
      enabled: true,
      properties: [],
    },
  };
};

export const getDefaultDtosForRelatedEntity = (
  entity: Entity,
  relatedEntity: Entity
): entityDefaultNestedDtos => {
  const entityPascalPluralName = pascalCase(
    prepareEntityPluralName(entity.name)
  );
  const nestedEntityPascalName = pascalCase(relatedEntity.name);
  const entityDisplayName = entity.displayName;

  return {
    [EnumModuleDtoType.CreateNestedManyInput]: {
      dtoType: EnumModuleDtoType.CreateNestedManyInput,
      name: `${nestedEntityPascalName}CreateNestedManyWithout${entityPascalPluralName}Input`,
      description: `Input type for ${entityDisplayName} creation with related ${nestedEntityPascalName}`,
      enabled: true,
      properties: [],
    },
    [EnumModuleDtoType.UpdateNestedManyInput]: {
      dtoType: EnumModuleDtoType.UpdateNestedManyInput,
      name: `${nestedEntityPascalName}UpdateManyWithout${entityPascalPluralName}Input`,
      description: `Input type for ${entityDisplayName} retrieval`,
      enabled: true,
      properties: [],
    },
  };
};

export const getDefaultDtosForEnumField = (
  entity: Entity,
  enumField: EntityField
): ModuleDto => {
  return {
    dtoType: EnumModuleDtoType.Enum,
    name: createEnumName(enumField, entity),
    description: `Enum type for field ${enumField.name} of ${entity.displayName} model`,
    enabled: true,
    properties: [],
  };
};

export function createEnumName(field: EntityField, entity: Entity): string {
  return `Enum${pascalCase(entity.name)}${pascalCase(field.name)}`;
}
