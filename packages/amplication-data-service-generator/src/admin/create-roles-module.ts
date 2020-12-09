import { Module, Role } from "../types";
import { SRC_DIRECTORY } from "./constants";

export function createRolesModule(roles: Role[]): Module {
  return {
    path: `${SRC_DIRECTORY}/users/roles.json`,
    code: JSON.stringify(roles, null, 2),
  };
}
