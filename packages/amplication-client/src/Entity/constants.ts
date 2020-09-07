import * as models from "../models";
import * as permissionTypes from "../Permissions/types";

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
    icon: "box",
  },
  [models.EnumDataType.Email]: {
    label: "Email",
    icon: "at_sign",
  },
  [models.EnumDataType.AutoNumber]: {
    label: "Auto Number",
    icon: "bookmark",
  },
  [models.EnumDataType.WholeNumber]: {
    label: "Whole Number",
    icon: "bookmark",
  },
  [models.EnumDataType.DateTime]: {
    label: "Date Time",
    icon: "calendar",
  },
  [models.EnumDataType.DecimalNumber]: {
    label: "Decimal Number",
    icon: "bookmark",
  },
  [models.EnumDataType.Lookup]: {
    label: "Lookup",
    icon: "bookmark",
  },
  [models.EnumDataType.MultiSelectOptionSet]: {
    label: "Multi Select Option Set",
    icon: "bookmark",
  },
  [models.EnumDataType.OptionSet]: {
    label: "Option Set",
    icon: "bookmark",
  },
  [models.EnumDataType.Boolean]: {
    label: "Boolean",
    icon: "check_square",
  },
  [models.EnumDataType.CreatedAt]: {
    label: "Created At",
    icon: "calendar",
  },
  [models.EnumDataType.UpdatedAt]: {
    label: "Updated At",
    icon: "calendar",
  },
  [models.EnumDataType.GeographicAddress]: {
    label: "Geographic Address",
    icon: "map_pin",
  },
  [models.EnumDataType.Id]: {
    label: "Id",
    icon: "bookmark",
  },
};
