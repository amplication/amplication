import * as models from "./models";

export {
  EnumEntityPermissionType,
  EnumEntityAction,
  EnumDataType,
} from "./models";

export type Role = Omit<
  models.AppRole,
  "__typename" | "id" | "createdAt" | "updatedAt"
>;

export type EntityPermissionRole = Omit<
  models.EntityPermissionRole,
  | "__typename"
  | "id"
  | "entityVersionId"
  | "action"
  | "entityPermission"
  | "appRoleId"
  | "appRole"
> & {
  appRole: Role;
};

export type EntityPermissionField = Omit<
  models.EntityPermissionField,
  | "__typename"
  | "id"
  | "permissionId"
  | "permission"
  | "fieldPermanentId"
  | "field"
  | "entityVersionId"
  | "permissionFieldRoles"
> & {
  field: EntityField;
  permissionFieldRoles: EntityPermissionRole[];
};

export type EntityPermission = Omit<
  models.EntityPermission,
  | "__typename"
  | "id"
  | "entityVersionId"
  | "entityVersion"
  | "permissionRoles"
  | "permissionFields"
> & {
  permissionRoles: EntityPermissionRole[];
  permissionFields: EntityPermissionField[];
};

export type EntityField = Omit<
  models.EntityField,
  | "__typename"
  | "id"
  | "fieldPermanentId"
  | "createdAt"
  | "updatedAt"
  | "position"
>;

export type Entity = Omit<
  models.Entity,
  | "__typename"
  | "id"
  | "createdAt"
  | "updatedAt"
  | "app"
  | "appId"
  | "entityVersions"
  | "fields"
  | "permissions"
  | "lockedByUserId"
  | "lockedByUser"
  | "lockedAt"
> & {
  fields: EntityField[];
  permissions: EntityPermission[];
};
