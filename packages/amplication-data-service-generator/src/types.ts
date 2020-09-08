import * as models from "./models";

export type FullPermissionRole = Omit<
  models.EntityPermissionRole,
  "entityVersionId"
> & {
  appRole: models.AppRole;
};

export type FullPermissionField = Omit<
  models.EntityPermissionField,
  "permissionFieldRoles" | "entityVersionId"
> & {
  permissionFieldRoles: FullPermissionRole[];
};

export type FullPermission = Omit<
  models.EntityPermission,
  "entityVersionId" | "permissionRoles" | "permissionFields"
> & {
  permissionRoles: FullPermissionRole[];
  permissionFields: FullPermissionField[];
};

export type FullEntity = Omit<models.Entity, "fields" | "permissions"> & {
  fields: models.EntityField[];
  permissions: FullPermission[];
};
