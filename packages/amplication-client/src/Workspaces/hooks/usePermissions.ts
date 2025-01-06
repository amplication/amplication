import { useQuery } from "@apollo/client";
import { GET_PERMISSIONS } from "../queries/workspaceQueries";
import { useState } from "react";
import { RolesPermissions } from "@amplication/util-roles-types";

export interface IPermissions {
  allowedTasks: Record<RolesPermissions, boolean>;
  canPerformTask: (task: RolesPermissions) => boolean;
  isAdmin: boolean;
}

const usePermissions = (): IPermissions => {
  const [allowedTasks, setAllowedTasks] = useState<
    Record<RolesPermissions, boolean>
  >({} as Record<RolesPermissions, boolean>);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useQuery<{ permissions: string[] }>(GET_PERMISSIONS, {
    onCompleted: (data) => {
      setIsAdmin(data?.permissions.includes("*") || false);
      setAllowedTasks(() => {
        if (!data || !data.permissions) {
          return {} as Record<RolesPermissions, boolean>;
        }

        return data.permissions.reduce(
          (acc, permission) => ({ ...acc, [permission]: true }),
          {} as Record<RolesPermissions, boolean>
        );
      });
    },
  });

  const canPerformTask = (task: RolesPermissions) => {
    return isAdmin || allowedTasks[task] || false;
  };

  return {
    allowedTasks,
    canPerformTask,
    isAdmin,
  };
};

export default usePermissions;
