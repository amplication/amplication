import {
  Entity,
  EnumDataType,
  EnumPrivateDataType,
  EntityField,
} from "./types";

export const USER_ENTITY_NAME = "User";

export const USER_AUTH_FIELDS: EntityField[] = [
  {
    name: "username",
    displayName: "Username",
    /** @todo change to text field and add unique: true */
    dataType: EnumPrivateDataType.Username,
    required: true,
    searchable: false,
  },
  {
    name: "password",
    displayName: "Password",
    dataType: EnumDataType.SingleLineText,
    required: true,
    searchable: false,
  },
  {
    name: "roles",
    displayName: "Roles",
    dataType: EnumPrivateDataType.Roles,
    required: true,
    searchable: false,
    properties: {},
  },
];

export const DEFAULT_USER_ENTITY: Entity = {
  id: "user-model-id",
  name: USER_ENTITY_NAME,
  displayName: "User",
  pluralDisplayName: "Users",
  fields: USER_AUTH_FIELDS,
  permissions: [],
};
