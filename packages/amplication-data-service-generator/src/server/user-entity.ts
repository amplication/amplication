import {
  Entity,
  EnumDataType,
  EntityField,
  EnumEntityPermissionType,
  EnumEntityAction,
} from "../types";

export const USER_ENTITY_NAME = "User";

export const USER_NAME_FIELD: EntityField = {
  id: "USER_NAME_FIELD",
  permanentId: "USER_NAME_FIELD_PERMANENT_ID",
  name: "username",
  displayName: "Username",
  dataType: EnumDataType.Username,
  required: true,
  searchable: false,
};

export const USER_PASSWORD_FIELD: EntityField = {
  id: "USER_PASSWORD_FIELD",
  permanentId: "USER_PASSWORD_FIELD_PERMANENT_ID",
  name: "password",
  displayName: "Password",
  dataType: EnumDataType.Password,
  required: true,
  searchable: false,
};

export const USER_ROLES_FIELD: EntityField = {
  id: "USER_ROLES_FIELD",
  permanentId: "USER_ROLES_FIELD_PERMANENT_ID",
  name: "roles",
  displayName: "Roles",
  dataType: EnumDataType.Roles,
  required: true,
  searchable: false,
  properties: {},
};

const USER_ID_FIELD: EntityField = {
  id: "USER_ID_FIELD",
  permanentId: "USER_ID_FIELD_PERMANENT_ID",
  name: "id",
  displayName: "Id",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
};

export const USER_AUTH_FIELDS: EntityField[] = [
  USER_NAME_FIELD,
  USER_PASSWORD_FIELD,
  USER_ROLES_FIELD,
];

export const DEFAULT_USER_ENTITY: Entity = {
  id: "user-model-id",
  name: USER_ENTITY_NAME,
  displayName: "User",
  pluralDisplayName: "Users",
  fields: [USER_ID_FIELD, ...USER_AUTH_FIELDS],
  permissions: [
    {
      action: EnumEntityAction.Create,
      permissionFields: [],
      permissionRoles: [],
      type: EnumEntityPermissionType.AllRoles,
    },
    {
      action: EnumEntityAction.Delete,
      permissionFields: [],
      permissionRoles: [],
      type: EnumEntityPermissionType.AllRoles,
    },
    {
      action: EnumEntityAction.Search,
      permissionFields: [],
      permissionRoles: [],
      type: EnumEntityPermissionType.AllRoles,
    },
    {
      action: EnumEntityAction.Update,
      permissionFields: [],
      permissionRoles: [],
      type: EnumEntityPermissionType.AllRoles,
    },
    {
      action: EnumEntityAction.View,
      permissionFields: [],
      permissionRoles: [],
      type: EnumEntityPermissionType.AllRoles,
    },
  ],
};

export class InvalidDataTypeError extends Error {
  constructor(fields: EntityField[]) {
    super(
      `Invalid fields data types: ${fields
        .map((field) => `${field.name} data type should be ${field.dataType}`)
        .join(", ")}`
    );
  }
}

export function createUserEntityIfNotExist(
  entities: Entity[]
): [Entity[], Entity] {
  let userEntity;
  const nextEntities = entities.map((entity) => {
    if (entity.name === USER_ENTITY_NAME) {
      userEntity = entity;
      const missingAuthFields = getMissingAuthFields(entity.fields);
      //Add any missing auth field for backward compatibility with previously created apps
      return {
        ...entity,
        fields: [...missingAuthFields, ...entity.fields],
      };
    }
    return entity;
  });
  if (!userEntity) {
    userEntity = DEFAULT_USER_ENTITY;
    nextEntities.unshift(userEntity);
  }
  return [nextEntities, userEntity];
}

export function getMissingAuthFields(fields: EntityField[]): EntityField[] {
  const fieldsByName = Object.fromEntries(
    fields.map((field) => [field.name, field])
  );
  const missingAuthFields: EntityField[] = [];
  const invalidDataTypeAuthFields: EntityField[] = [];
  for (const field of USER_AUTH_FIELDS) {
    if (field.name in fieldsByName) {
      if (fieldsByName[field.name].dataType !== field.dataType) {
        invalidDataTypeAuthFields.push(field);
      }
    } else {
      missingAuthFields.push(field);
    }
  }

  if (invalidDataTypeAuthFields.length) {
    throw new InvalidDataTypeError(invalidDataTypeAuthFields);
  }

  return missingAuthFields;
}
