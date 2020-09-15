import * as models from "./models";

export type FullAppRole = Omit<
  models.AppRole,
  "__typename" | "id" | "createdAt" | "updatedAt"
>;

export type FullPermissionRole = Omit<
  models.EntityPermissionRole,
  | "__typename"
  | "id"
  | "entityVersionId"
  | "action"
  | "entityPermission"
  | "appRoleId"
  | "appRole"
> & {
  appRole: FullAppRole;
};

export type FullPermissionField = Omit<
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
  field: FullEntityField;
  permissionFieldRoles: FullPermissionRole[];
};

export type FullPermission = Omit<
  models.EntityPermission,
  | "__typename"
  | "id"
  | "entityVersionId"
  | "entityVersion"
  | "permissionRoles"
  | "permissionFields"
> & {
  permissionRoles: FullPermissionRole[];
  permissionFields: FullPermissionField[];
};

export type FullEntityField = Omit<
  models.EntityField,
  | "__typename"
  | "id"
  | "fieldPermanentId"
  | "createdAt"
  | "updatedAt"
  | "position"
>;

export type FullEntity = Omit<
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
  fields: FullEntityField[];
  permissions: FullPermission[];
};
