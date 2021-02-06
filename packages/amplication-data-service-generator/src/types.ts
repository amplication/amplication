import { types } from "@amplication/data";
import * as models from "./models";

export {
  EnumEntityPermissionType,
  EnumEntityAction,
  EnumDataType,
} from "./models";

export type WorkerResult = {
  done: boolean;
  message?: string;
  modules?: Module[];
  error?: any;
};

export type WorkerParam = {
  entities: Entity[];
  roles: Role[];
  appInfo: AppInfo;
};

export type AppInfo = {
  name: string;
  description: string;
  version: string;
};

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
  permissionFieldRoles: EntityPermissionRole[] | null;
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
  | "permanentId"
  | "createdAt"
  | "updatedAt"
  | "position"
  | "dataType"
> & {
  dataType: models.EnumDataType;
};

export type LookupResolvedProperties = types.Lookup & {
  relatedEntity: Entity;
  relatedField: EntityField;
};

export type EntityLookupField = Omit<EntityField, "properties"> & {
  properties: LookupResolvedProperties;
};

export type EntityOptionSetField = Omit<EntityField, "properties"> & {
  properties: types.OptionSet;
};

export type EntityMultiSelectOptionSetField = Omit<
  EntityField,
  "properties"
> & {
  properties: types.MultiSelectOptionSet;
};

export type Entity = Omit<
  models.Entity,
  | "__typename"
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

export type Module = {
  path: string;
  code: string;
};
