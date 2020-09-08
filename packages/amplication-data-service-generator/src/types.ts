import * as models from "./models";

export type FullPermissionRole = models.EntityPermissionRole & {
  appRole: models.AppRole;
};

export type FullPermissionField = models.EntityPermissionField & {
  permissionFieldRoles: FullPermissionRole[];
};

export type FullPermission = models.EntityPermission & {
  permissionRoles: FullPermissionRole[];
  permissionFields: FullPermissionField[];
};

export type FullEntity = models.Entity & {
  fields: models.EntityField[];
  permissions: FullPermission[];
};
