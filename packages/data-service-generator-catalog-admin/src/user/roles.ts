
export interface Role {
  name: string;
  displayName: string;
}

export const ROLES: Role[] = [
  {
    name: "user",
    displayName: "User",
  },
];

type RoleUpdateCallback = (updatedRoles: Role[]) => void;

let roleUpdateCallback: RoleUpdateCallback | null = null;

export const setRoleUpdateCallback = (callback: RoleUpdateCallback) => {
  roleUpdateCallback = callback;
};

export const updateRole = (oldName: string, newName: string) => {
  const roleIndex = ROLES.findIndex((role) => role.name === oldName);

  if (roleIndex !== -1) {
    // Update the role name
    ROLES[roleIndex].name = newName;

    // Notify about the role update
    if (roleUpdateCallback) {
      roleUpdateCallback(ROLES);
    }
  }
};

