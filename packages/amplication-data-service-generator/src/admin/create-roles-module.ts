import { Module, Role } from "../types";
import { SRC_DIRECTORY } from "./constants";

export function createRolesModule(roles: Role[]): Module {
  return {
    path: `${SRC_DIRECTORY}/user/roles.ts`,
    code: `export const ROLES = ${JSON.stringify(
      roles.map((role) => ({ name: role.name, displayName: role.displayName })),
      null,
      2
    )}`,
  };
}
