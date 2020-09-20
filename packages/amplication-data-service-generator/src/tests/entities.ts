import {
  Entity,
  EnumDataType,
  EnumEntityPermissionType,
  EnumEntityAction,
} from "../types";

const entities: Entity[] = [
  {
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
  },
];

export default entities;
