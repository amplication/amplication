import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { RolesPermissions } from "@amplication/util-roles-types";
import { useAppContext } from "../../context/appContext";
import { IPermissions } from "../../Workspaces/hooks/usePermissions";

const useResourcePermissions = (resourceId: string): IPermissions => {
  const { permissions: workspacePermissions } = useAppContext();

  const [allowedTasks, setAllowedTasks] = useState<
    Record<RolesPermissions, boolean>
  >({} as Record<RolesPermissions, boolean>);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useQuery<{ resourcePermissions: string[] }>(GET_RESOURCE_PERMISSIONS, {
    variables: {
      resourceId,
    },
    skip: !resourceId,
    onCompleted: (data) => {
      setIsAdmin(
        workspacePermissions.isAdmin ||
          data?.resourcePermissions.includes("*") ||
          false
      );
      setAllowedTasks(() => {
        if (!data || !data.resourcePermissions) {
          return workspacePermissions.allowedTasks;
        }

        const resourceAllowedTasks = data.resourcePermissions.reduce(
          (acc, permission) => ({ ...acc, [permission]: true }),
          {} as Record<RolesPermissions, boolean>
        );

        return {
          ...workspacePermissions.allowedTasks,
          ...resourceAllowedTasks,
        };
      });
    },
  });

  const canPerformTask = (task: RolesPermissions) => {
    console.log("canPerformTask", task);
    console.log(
      "workspacePermissions",
      workspacePermissions.canPerformTask(task)
    );
    console.log("isAdmin", isAdmin);
    console.log("allowedTasks[task]", allowedTasks[task]);

    return (
      workspacePermissions.canPerformTask(task) ||
      isAdmin ||
      allowedTasks[task] ||
      false
    );
  };

  return {
    canPerformTask,
    allowedTasks,
    isAdmin,
  };
};

export default useResourcePermissions;

export const GET_RESOURCE_PERMISSIONS = gql`
  query resourcePermissions($resourceId: String!) {
    resourcePermissions(where: { id: $resourceId })
  }
`;
