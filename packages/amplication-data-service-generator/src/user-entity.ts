import {
  Entity,
  EnumDataType,
  EntityField,
  EnumEntityPermissionType,
  EnumEntityAction,
} from "./types";

export const USER_ENTITY_NAME = "User";

export const USER_NAME_FIELD = {
  name: "username",
  displayName: "Username",
  /** @todo change to text field and add unique: true */
  dataType: EnumDataType.Username,
  required: true,
  searchable: false,
};

export const USER_PASSWORD_FIELD = {
  name: "password",
  displayName: "Password",
  dataType: EnumDataType.SingleLineText,
  required: true,
  searchable: false,
};

export const USER_ROLES_FIELD = {
  name: "roles",
  displayName: "Roles",
  dataType: EnumDataType.Roles,
  required: true,
  searchable: false,
  properties: {},
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
  fields: [
    {
      name: "id",
      displayName: "Id",
      dataType: EnumDataType.Id,
      required: true,
      searchable: false,
    },
    ...USER_AUTH_FIELDS,
  ],
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
