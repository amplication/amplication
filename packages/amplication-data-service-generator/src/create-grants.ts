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

/**
 * @todo connect the created grants json to the access control service
 */

export const ALL_ATTRIBUTES = "*";
export const CREATE_ANY = "create:any";
export const DELETE_ANY = "delete:any";
export const READ_ANY = "read:any";
export const UPDATE_ANY = "update:any";

export function createGrantsModule(
  entities: FullEntity[],
  roles: models.AppRole[]
): Module {
  return {
    path: "grants.json",
    code: JSON.stringify(createGrants(entities, roles)),
  };
}

export function createGrants(
  entities: FullEntity[],
  roles: models.AppRole[]
): Grant[] {
  const grants: Grant[] = [];
  for (const entity of entities) {
    for (const permission of entity.permissions) {
      if (!permission.permissionRoles) {
        /** @todo */
        throw new Error("Not implemented");
      }
      switch (permission.type) {
        case models.EnumEntityPermissionType.Disabled:
          continue;
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
        }
        case models.EnumEntityPermissionType.Granular: {
          for (const { appRole } of permission.permissionRoles) {
            grants.push({
              role: appRole.name,
              resource: entity.name,
              action: actionToACLAction[permission.action],
              /** @todo */
              attributes: ALL_ATTRIBUTES,
            });
          }
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
  [models.EnumEntityAction.View]: READ_ANY,
};
