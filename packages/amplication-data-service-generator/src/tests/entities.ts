import { FullEntity } from "../types";
import * as models from "../models";

const entities: FullEntity[] = [
  {
    name: "Customer",
    displayName: "Customer",
    pluralDisplayName: "Customers",
    fields: [
      {
        name: "id",
        displayName: "Id",
        dataType: models.EnumDataType.Id,
        properties: {},
        required: true,
        searchable: false,
        description: "",
      },
      {
        name: "createdAt",
        displayName: "Created At",
        dataType: models.EnumDataType.CreatedAt,
        properties: {},
        required: true,
        searchable: false,
        description: "",
      },
      {
        name: "updatedAt",
        displayName: "Updated At",
        dataType: models.EnumDataType.UpdatedAt,
        properties: {},
        required: true,
        searchable: false,
        description: "",
      },
      {
        name: "email",
        displayName: "Email",
        dataType: models.EnumDataType.Email,
        properties: {},
        required: true,
        searchable: false,
        description: "",
      },
      {
        name: "firstName",
        displayName: "First Name",
        dataType: models.EnumDataType.SingleLineText,
        properties: {},
        required: true,
        searchable: false,
        description: "",
      },
      {
        name: "lastName",
        displayName: "Last Name",
        dataType: models.EnumDataType.SingleLineText,
        properties: {},
        required: true,
        searchable: false,
        description: "",
      },
    ],
    permissions: [
      {
        action: models.EnumEntityAction.Create,
        permissionFields: [],
        permissionRoles: [],
        type: models.EnumEntityPermissionType.AllRoles,
      },
      {
        action: models.EnumEntityAction.Delete,
        permissionFields: [],
        permissionRoles: [],
        type: models.EnumEntityPermissionType.AllRoles,
      },
      {
        action: models.EnumEntityAction.Search,
        permissionFields: [],
        permissionRoles: [],
        type: models.EnumEntityPermissionType.AllRoles,
      },
      {
        action: models.EnumEntityAction.Update,
        permissionFields: [],
        permissionRoles: [],
        type: models.EnumEntityPermissionType.AllRoles,
      },
      {
        action: models.EnumEntityAction.View,
        permissionFields: [],
        permissionRoles: [],
        type: models.EnumEntityPermissionType.AllRoles,
      },
    ],
  },
];

export default entities;
