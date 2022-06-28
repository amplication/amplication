import { Module, Role } from "../types";

export function createRolesModule(roles: Role[], srcDirectory: string): Module {
  return {
    path: `${srcDirectory}/user/roles.ts`,
    code: `export const ROLES = ${JSON.stringify(
      roles.map((role) => ({ name: role.name, displayName: role.displayName })),
      null,
      2
    )}`,
  };
}
