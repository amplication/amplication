import {
  Entity,
  EntityField,
  EntityPermission,
  EntityPermissionRole,
  EntityPermissionField,
  AppRole,
} from "./models";

export type FullEntity = Entity & {
  fields: EntityField[];
  permissions: Array<
    EntityPermission & {
      permissionRoles: EntityPermissionRole[];
      permissionFields: Array<
        EntityPermissionField & {
          permissionFieldRoles: Array<
            EntityPermissionRole & {
              appRoles: AppRole[];
            }
          >;
        }
      >;
    }
  >;
};
