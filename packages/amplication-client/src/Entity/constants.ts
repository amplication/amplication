import * as models from "../models";
import * as permissionTypes from "../Permissions/types";

export const USER_ENTITY = "User";

export const ENTITY_ACTIONS: permissionTypes.PermissionAction[] = [
  {
    action: models.EnumEntityAction.View,
    actionDisplayName: "View",
    canSetFields: true,
  },
  {
    action: models.EnumEntityAction.Create,
    actionDisplayName: "Create",
    canSetFields: true,
  },
  {
    action: models.EnumEntityAction.Update,
    actionDisplayName: "Update",
    canSetFields: true,
  },
  {
    action: models.EnumEntityAction.Delete,
    actionDisplayName: "Delete",
    canSetFields: false,
  },
  {
    action: models.EnumEntityAction.Search,
    actionDisplayName: "Search",
    canSetFields: true,
  },
];

export const SYSTEM_DATA_TYPES: Set<models.EnumDataType> = new Set([
  models.EnumDataType.Id,
]);

export const AUTHENTICATION_ENTITY_DATA_TYPES: Set<models.EnumDataType> =
  new Set([models.EnumDataType.Username, models.EnumDataType.Password]);

export const DATA_TYPE_TO_LABEL_AND_ICON: {
  [key in models.EnumDataType]: {
    label: string;
    icon: string;
  };
} = {
  /**@todo: update the icons for each type */
  [models.EnumDataType.SingleLineText]: {
    label: "Single Line Text",
    icon: "type",
  },
  [models.EnumDataType.MultiLineText]: {
    label: "Multi Line Text",
    icon: "multiline_text",
  },
  [models.EnumDataType.Email]: {
    label: "Email",
    icon: "at_sign",
  },
  [models.EnumDataType.WholeNumber]: {
    label: "Whole Number",
    icon: "bookmark",
  },
  [models.EnumDataType.DecimalNumber]: {
    label: "Decimal Number",
    icon: "decimal_number",
  },
  [models.EnumDataType.DateTime]: {
    label: "Date Time",
    icon: "calendar",
  },
  [models.EnumDataType.Lookup]: {
    label: "Relation to Entity",
    icon: "lookup",
  },
  [models.EnumDataType.Boolean]: {
    label: "Boolean",
    icon: "check_square",
  },
  [models.EnumDataType.Json]: {
    label: "Json",
    icon: "code1",
  },
  [models.EnumDataType.OptionSet]: {
    label: "Option Set",
    icon: "option_set",
  },
  [models.EnumDataType.MultiSelectOptionSet]: {
    label: "Multi Select Option Set",
    icon: "multi_select_option_set",
  },
  [models.EnumDataType.GeographicLocation]: {
    label: "Geographic Location",
    icon: "map_pin",
  },
  [models.EnumDataType.CreatedAt]: {
    label: "Created At",
    icon: "created_at",
  },
  [models.EnumDataType.UpdatedAt]: {
    label: "Updated At",
    icon: "updated_at",
  },

  [models.EnumDataType.Id]: {
    label: "Id",
    icon: "id",
  },
  [models.EnumDataType.Username]: {
    label: "Username",
    icon: "user",
  },
  [models.EnumDataType.Password]: {
    label: "Password",
    icon: "lock",
  },
  [models.EnumDataType.Roles]: {
    label: "Roles",
    icon: "users",
  },
};

export const ENTITY_FIELD_ENUM_MAPPER: {
  [key in models.EnumDataType]: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  };
} = {
  /**@todo: update the icons for each type */
  [models.EnumDataType.SingleLineText]: {},
  [models.EnumDataType.MultiLineText]: {},
  [models.EnumDataType.Email]: {},
  [models.EnumDataType.WholeNumber]: {
    databaseFieldType: [
      {
        label: "Integer",
        value: "INT",
      },
      {
        label: "Big Integer",
        value: "BIG_INT",
      },
    ],
  },
  [models.EnumDataType.DecimalNumber]: {
    databaseFieldType: [
      { label: "Decimal", value: "DECIMAL" },
      { label: "Float", value: "FLOAT" },
    ],
  },
  [models.EnumDataType.DateTime]: {
    timeZone: [
      { label: "Local Time", value: "localTime" },
      { label: "Server Time", value: "serverTime" },
    ],
  },
  [models.EnumDataType.Lookup]: {},
  [models.EnumDataType.Boolean]: {},
  [models.EnumDataType.Json]: {},
  [models.EnumDataType.OptionSet]: {},
  [models.EnumDataType.MultiSelectOptionSet]: {},
  [models.EnumDataType.GeographicLocation]: {},
  [models.EnumDataType.CreatedAt]: {},
  [models.EnumDataType.UpdatedAt]: {},
  [models.EnumDataType.Id]: {
    idType: [
      { label: "UUID", value: "UUID" },
      { label: "CUID", value: "CUID" },
      { label: "Auto Increment Integer", value: "AUTO_INCREMENT" },
      {
        label: "Auto Increment Big Integer",
        value: "AUTO_INCREMENT_BIG_INT",
      },
    ],
  },
  [models.EnumDataType.Username]: {},
  [models.EnumDataType.Password]: {},
  [models.EnumDataType.Roles]: {},
};
