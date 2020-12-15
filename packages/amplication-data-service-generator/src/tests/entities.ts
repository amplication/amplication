import {
  Entity,
  EnumDataType,
  EnumEntityPermissionType,
  EnumEntityAction,
} from "../types";

const CUSTOMER_ENTITY_ID = "b8d49afb-8c12-49fa-9d6e-eb64be0ddded";
const ORGANIZATION_ID = "3426e3f7-c316-416e-b7a1-d2a1bce17a4";

const USER: Entity = {
  id: "075c5413-42c3-4445-af6a-d8e5b8cbf53b",
  name: "User",
  displayName: "User",
  pluralDisplayName: "Users",
  fields: [
    {
      name: "id",
      displayName: "Id",
      dataType: EnumDataType.Id,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "name",
      displayName: "Name",
      required: true,
      searchable: false,
      dataType: EnumDataType.SingleLineText,
    },
    {
      name: "bio",
      displayName: "Bio",
      required: true,
      searchable: false,
      dataType: EnumDataType.MultiLineText,
    },
    {
      name: "email",
      displayName: "Email",
      required: true,
      searchable: false,
      dataType: EnumDataType.Email,
    },
    {
      name: "age",
      displayName: "Age",
      required: true,
      searchable: false,
      dataType: EnumDataType.WholeNumber,
    },
    {
      name: "birthDate",
      displayName: "Birth Date",
      required: true,
      searchable: false,
      dataType: EnumDataType.DateTime,
      properties: { dataOnly: false },
    },
    {
      name: "score",
      displayName: "Score",
      required: true,
      searchable: false,
      dataType: EnumDataType.DecimalNumber,
    },
    {
      name: "organization",
      displayName: "Organization",
      required: false,
      searchable: false,
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: ORGANIZATION_ID,
        allowMultipleSelection: false,
      },
    },
    {
      name: "interests",
      displayName: "Interests",
      required: true,
      searchable: false,
      dataType: EnumDataType.MultiSelectOptionSet,
      properties: {
        options: [
          { label: "Programming", value: "programming" },
          { label: "Design", value: "design" },
        ],
      },
    },
    {
      name: "priority",
      displayName: "Priority",
      required: true,
      searchable: false,
      dataType: EnumDataType.OptionSet,
      properties: {
        options: [
          { label: "High", value: "high" },
          { label: "Medium", value: "medium" },
          { label: "Low", value: "low" },
        ],
      },
    },
    {
      name: "isCurious",
      displayName: "Is Curious",
      required: true,
      searchable: false,
      dataType: EnumDataType.Boolean,
    },
    {
      name: "location",
      displayName: "Location",
      required: true,
      searchable: false,
      dataType: EnumDataType.GeographicLocation,
    },
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

const ORDER: Entity = {
  id: "dc63b5ef-e386-4a1c-b764-8926dd3066b8",
  name: "Order",
  displayName: "Order",
  pluralDisplayName: "Orders",
  fields: [
    {
      name: "id",
      displayName: "Id",
      dataType: EnumDataType.Id,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "createdAt",
      displayName: "Created At",
      dataType: EnumDataType.CreatedAt,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "updatedAt",
      displayName: "Updated At",
      dataType: EnumDataType.UpdatedAt,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "customer",
      displayName: "Customer",
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: CUSTOMER_ENTITY_ID,
      },
      required: true,
      searchable: false,
    },
    {
      name: "status",
      displayName: "Status",
      dataType: EnumDataType.OptionSet,
      properties: {
        options: [
          {
            label: "Pending",
            value: "pending",
          },
          {
            label: "In Progress",
            value: "inProgress",
          },
          {
            label: "Done",
            value: "done",
          },
        ],
      },
      required: true,
      searchable: false,
    },
    {
      name: "label",
      displayName: "Label",
      dataType: EnumDataType.OptionSet,
      properties: {
        options: [
          {
            label: "Fragile",
            value: "fragile",
          },
        ],
      },
      required: false,
      searchable: false,
    },
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

const ORGANIZATION: Entity = {
  id: ORGANIZATION_ID,
  name: "Organization",
  displayName: "Organization",
  pluralDisplayName: "Organizations",
  fields: [
    {
      name: "id",
      displayName: "Id",
      dataType: EnumDataType.Id,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "createdAt",
      displayName: "Created At",
      dataType: EnumDataType.CreatedAt,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "updatedAt",
      displayName: "Updated At",
      dataType: EnumDataType.UpdatedAt,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "name",
      displayName: "Name",
      dataType: EnumDataType.SingleLineText,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "customers",
      displayName: "Customers",
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: CUSTOMER_ENTITY_ID,
        allowMultipleSelection: true,
      },
      required: true,
      searchable: false,
    },
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

const CUSTOMER: Entity = {
  id: CUSTOMER_ENTITY_ID,
  name: "Customer",
  displayName: "Customer",
  pluralDisplayName: "Customers",
  fields: [
    {
      name: "id",
      displayName: "Id",
      dataType: EnumDataType.Id,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "createdAt",
      displayName: "Created At",
      dataType: EnumDataType.CreatedAt,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "updatedAt",
      displayName: "Updated At",
      dataType: EnumDataType.UpdatedAt,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "email",
      displayName: "Email",
      dataType: EnumDataType.Email,
      properties: {},
      required: true,
      searchable: false,
    },
    {
      name: "firstName",
      displayName: "First Name",
      dataType: EnumDataType.SingleLineText,
      properties: {},
      required: false,
      searchable: false,
    },
    {
      name: "lastName",
      displayName: "Last Name",
      dataType: EnumDataType.SingleLineText,
      properties: {},
      required: false,
      searchable: false,
    },
    {
      name: "isVip",
      displayName: "VIP",
      dataType: EnumDataType.Boolean,
      properties: {},
      required: false,
      searchable: false,
    },
    {
      name: "birthData",
      displayName: "Birth Data",
      dataType: EnumDataType.DateTime,
      properties: {
        timeZone: "localTime",
        dateOnly: true,
      },
      required: false,
      searchable: false,
    },
    {
      name: "averageSale",
      displayName: "Average Sale (-1500.00 - 1500.00)",
      dataType: EnumDataType.DecimalNumber,
      properties: {
        minimumValue: 1500,
        maximumValue: -1500,
        precision: 2,
      },
      required: false,
      searchable: false,
    },
    {
      name: "favoriteNumber",
      displayName: "Favorite Number (1 - 20)",
      dataType: EnumDataType.WholeNumber,
      properties: {
        minimumValue: 1,
        maximumValue: 20,
      },
      required: false,
      searchable: false,
    },
    {
      name: "geoLocation",
      displayName: "Geographic Location",
      dataType: EnumDataType.GeographicLocation,
      properties: {},
      required: false,
      searchable: false,
    },
    {
      name: "comments",
      displayName: "Comments (up to 500 characters)",
      dataType: EnumDataType.MultiLineText,
      properties: {
        maxLength: 500,
      },
      required: false,
      searchable: false,
    },
    {
      name: "favoriteColors",
      displayName: "Favorite Colors (multi-select)",
      dataType: EnumDataType.MultiSelectOptionSet,
      properties: {
        options: [
          {
            label: "Red",
            value: "red",
          },
          {
            label: "Green",
            value: "green",
          },
          {
            label: "Purple",
            value: "purple",
          },
          {
            label: "yellow",
            value: "yellow",
          },
        ],
      },
      required: false,
      searchable: false,
    },
    {
      name: "customerType",
      displayName: "Customer Type",
      dataType: EnumDataType.OptionSet,
      properties: {
        options: [
          {
            label: "Platinum",
            value: "platinum",
          },
          {
            label: "Gold",
            value: "gold",
          },
          {
            label: "Bronze",
            value: "bronze",
          },
          {
            label: "Regular",
            value: "regular",
          },
        ],
      },
      required: false,
      searchable: false,
    },
    {
      name: "organization",
      displayName: "Organization",
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: ORGANIZATION.id,
        allowMultipleSelection: false,
      },
      required: false,
      searchable: false,
    },
    {
      name: "orders",
      displayName: "Orders",
      dataType: EnumDataType.Lookup,
      properties: {
        relatedEntityId: ORDER.id,
        allowMultipleSelection: true,
      },
      required: false,
      searchable: false,
    },
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

const entities: Entity[] = [USER, ORDER, ORGANIZATION, CUSTOMER];

export default entities;
