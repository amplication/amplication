import difference from "@extra-set/difference";
import {
  Entity,
  Role,
  EnumEntityPermissionType,
  EnumEntityAction,
  Module,
} from "../types";
import { SRC_DIRECTORY } from "./constants";

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
 * Defines grant for a role to apply an action for a resource with attributes
 * @see https://github.com/onury/accesscontrol#defining-all-grants-at-once
 */
export type Grant = {
  role: string;
  resource: string;
  action: Action;
  attributes: string;
};

/**
 * Matches all resource attributes (glob notation)
 */
export const ALL_ATTRIBUTES_ALLOWED = "*";

// ACL actions
export const CREATE_ANY: Action = "create:any";
export const DELETE_ANY: Action = "delete:any";
export const READ_ANY: Action = "read:any";
export const UPDATE_ANY: Action = "update:any";
export const READ_OWN: Action = "read:own";

export const MODULE_PATH = `${SRC_DIRECTORY}/grants.json`;

/**
 * Creates a grants module from given entities and roles.
 * @param entities entities to create grants according to
 * @param roles all the existing roles
 * @returns grants JSON module
 */
export function createGrantsModule(entities: Entity[], roles: Role[]): Module {
  return {
    path: MODULE_PATH,
    code: JSON.stringify(createGrants(entities, roles), null, 2),
  };
}

export function createGrants(entities: Entity[], roles: Role[]): Grant[] {
  const grants: Grant[] = [];
  for (const entity of entities) {
    for (const permission of entity.permissions) {
      if (permission.type === EnumEntityPermissionType.Disabled) {
        continue;
      }
      const roleToFields: Record<string, Set<string>> = {};
      const fieldsWithRoles = new Set<string>();
      if (permission.permissionFields) {
        for (const permissionField of permission.permissionFields) {
          const { field } = permissionField;
          fieldsWithRoles.add(field.name);
          const roles = permissionField.permissionRoles || [];
          for (const permissionFieldRole of roles) {
            const role = permissionFieldRole.appRole.name;
            if (!(role in roleToFields)) {
              roleToFields[role] = new Set();
            }
            roleToFields[role].add(field.name);
          }
        }
      }
      switch (permission.type) {
        case EnumEntityPermissionType.AllRoles: {
          for (const role of roles) {
            grants.push({
              role: role.name,
              resource: entity.name,
              action: actionToACLAction[permission.action],
              /** @todo */
              attributes: ALL_ATTRIBUTES_ALLOWED,
            });
          }
          break;
        }
        case EnumEntityPermissionType.Granular: {
          if (!permission.permissionRoles) {
            throw new Error(
              "For granular permissions, permissionRoles must be defined"
            );
          }
          for (const { appRole } of permission.permissionRoles) {
            const fields = roleToFields[appRole.name] || new Set();
            /** Set of fields allowed other roles */
            const forbiddenFields = difference(fieldsWithRoles, fields);
            const attributes = createAttributes([
              ALL_ATTRIBUTES_ALLOWED,
              ...Array.from(forbiddenFields, (field: string) =>
                createNegativeAttributeMatcher(field)
              ),
            ]);
            grants.push({
              role: appRole.name,
              resource: entity.name,
              action: actionToACLAction[permission.action],
              attributes,
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

/** Combines attribute matchers to an attributes expression (glob notation) */
export function createAttributes(matchers: string[]): string {
  return matchers.join(",");
}

/**
 * @param attribute attribute name to exclude
 * @returns a matcher which unmatches a specific attribute (glob notation)
 */
export function createNegativeAttributeMatcher(attribute: string): string {
  return `!${attribute}`;
}

const actionToACLAction: { [key in EnumEntityAction]: Action } = {
  [EnumEntityAction.Create]: CREATE_ANY,
  [EnumEntityAction.Delete]: DELETE_ANY,
  [EnumEntityAction.Search]: READ_ANY,
  [EnumEntityAction.Update]: UPDATE_ANY,
  [EnumEntityAction.View]: READ_OWN,
};
