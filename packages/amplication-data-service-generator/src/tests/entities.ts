import {
  Entity,
  EnumDataType,
  EnumEntityPermissionType,
  EnumEntityAction,
} from "../types";

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
      description: "",
    },
    {
      name: "createdAt",
      displayName: "Created At",
      dataType: EnumDataType.CreatedAt,
      properties: {},
      required: true,
      searchable: false,
      description: "",
    },
    {
      name: "updatedAt",
      displayName: "Updated At",
      dataType: EnumDataType.UpdatedAt,
      properties: {},
      required: true,
      searchable: false,
      description: "",
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
  id: "b8d49afb-8c12-49fa-9d6e-eb64be0ddded",
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
      description: "",
    },
    {
      name: "createdAt",
      displayName: "Created At",
      dataType: EnumDataType.CreatedAt,
      properties: {},
      required: true,
      searchable: false,
      description: "",
    },
    {
      name: "updatedAt",
      displayName: "Updated At",
      dataType: EnumDataType.UpdatedAt,
      properties: {},
      required: true,
      searchable: false,
      description: "",
    },
    {
      name: "email",
      displayName: "Email",
      dataType: EnumDataType.Email,
      properties: {},
      required: true,
      searchable: false,
      description: "",
    },
    {
      name: "firstName",
      displayName: "First Name",
      dataType: EnumDataType.SingleLineText,
      properties: {},
      required: true,
      searchable: false,
      description: "",
    },
    {
      name: "lastName",
      displayName: "Last Name",
      dataType: EnumDataType.SingleLineText,
      properties: {},
      required: true,
      searchable: false,
      description: "",
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
      description: "",
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

const entities: Entity[] = [CUSTOMER, ORDER];

export default entities;
