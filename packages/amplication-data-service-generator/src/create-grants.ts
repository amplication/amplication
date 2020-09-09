import difference from "@extra-set/difference";
import { FullEntity } from "./types";
import * as models from "./models";
import { Module } from "./util/module";

type Action =
  | "create:any"
  | "read:any"
  | "update:any"
  | "delete:any"
  | "create:own"
  | "read:own"
  | "update:own"
  | "delete:own";

/**
 * @see https://github.com/onury/accesscontrol#defining-all-grants-at-once
 */
export type Grant = {
  role: string;
  resource: string;
  action: Action;
  attributes: string;
};

export const ALL_ATTRIBUTES = "*";
export const CREATE_ANY = "create:any";
export const DELETE_ANY = "delete:any";
export const READ_ANY = "read:any";
export const UPDATE_ANY = "update:any";
export const READ_OWN = "read:own";

export const GRANTS_MODULE_PATH = "grants.json";

export function createGrantsModule(
  entities: FullEntity[],
  roles: models.AppRole[]
): Module {
  return {
    path: GRANTS_MODULE_PATH,
    code: JSON.stringify(createGrants(entities, roles), null, 2),
  };
}

export function createGrants(
  entities: FullEntity[],
  roles: models.AppRole[]
): Grant[] {
  const grants: Grant[] = [];
  for (const entity of entities) {
    for (const permission of entity.permissions) {
      if (permission.type === models.EnumEntityPermissionType.Disabled) {
        continue;
      }
      const roleToFields: Record<string, Set<string>> = {};
      const fieldsWithRoles = new Set();
      if (permission.permissionFields) {
        for (const permissionField of permission.permissionFields) {
          if (!permissionField.permissionFieldRoles) {
            throw new Error("permissionFieldRoles must be an array");
          }
          for (const permissionFieldRole of permissionField.permissionFieldRoles) {
            const role = permissionFieldRole.appRole.name;
            if (!(role in roleToFields)) {
              roleToFields[role] = new Set();
            }
            const { field } = permissionField;
            roleToFields[role].add(field.name);
            fieldsWithRoles.add(field.name);
          }
        }
      }
      switch (permission.type) {
        case models.EnumEntityPermissionType.AllRoles: {
          for (const role of roles) {
            grants.push({
              role: role.name,
              resource: entity.name,
              action: actionToACLAction[permission.action],
              /** @todo */
              attributes: ALL_ATTRIBUTES,
            });
          }
          break;
        }
        case models.EnumEntityPermissionType.Granular: {
          if (!permission.permissionRoles) {
            throw new Error(
              "For granular permissions, permissionRoles must be defined"
            );
          }
          for (const { appRole } of permission.permissionRoles) {
            const fields = roleToFields[appRole.name];
            const forbiddenFields = difference(fieldsWithRoles, fields);
            grants.push({
              role: appRole.name,
              resource: entity.name,
              action: actionToACLAction[permission.action],
              attributes: [
                ALL_ATTRIBUTES,
                ...Array.from(forbiddenFields, (field) => `!${field}`),
              ].join(","),
            });
          }
          break;
        }
        default: {
          throw new Error(`Unexpected type: ${permission.type}`);
        }
      }
    }
  }
  return grants;
}

const actionToACLAction: { [key in models.EnumEntityAction]: Action } = {
  [models.EnumEntityAction.Create]: CREATE_ANY,
  [models.EnumEntityAction.Delete]: DELETE_ANY,
  [models.EnumEntityAction.Search]: READ_ANY,
  [models.EnumEntityAction.Update]: UPDATE_ANY,
  [models.EnumEntityAction.View]: READ_OWN,
};
