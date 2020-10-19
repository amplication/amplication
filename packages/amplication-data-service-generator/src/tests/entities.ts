import {
  Entity,
  EnumDataType,
  EnumEntityPermissionType,
  EnumEntityAction,
} from "../types";

const CUSTOMER_ENTITY_ID = "b8d49afb-8c12-49fa-9d6e-eb64be0ddded";

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
  id: "3426e3f7-c316-416e-b7a1-d2a1bce17a4",
  name: "Organization",
  displayName: "Organization",
  pluralDisplayName: "Organization",
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

const entities: Entity[] = [ORDER, ORGANIZATION, CUSTOMER];

export default entities;
