import { ROLES } from "./roles";

declare interface Role {
  name: string;
  displayName: string;
}

export const ROLES_OPTIONS = ROLES.map((role: Role) => ({
  value: role.name,
  label: role.displayName,
}));
