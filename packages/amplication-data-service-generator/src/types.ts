import * as models from "./models";

export type FullPermission = models.EntityPermission & {
  permissionRoles: models.EntityPermissionRole[];
  permissionFields: Array<
    models.EntityPermissionField & {
      permissionFieldRoles: Array<
        models.EntityPermissionRole & {
          appRole: models.AppRole;
        }
      >;
    }
  >;
};

export type FullEntity = models.Entity & {
  fields: models.EntityField[];
  permissions: FullPermission[];
};
