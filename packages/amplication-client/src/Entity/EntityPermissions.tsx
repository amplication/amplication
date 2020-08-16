import React, { useMemo } from "react";
import * as models from "../models";
import * as types from "../types";

type Props = {
  permissions: models.EntityPermission[];
  availableActions: types.PermissionAction[];
  onClick: () => void;
};

function EntityPermissions({ permissions, availableActions, onClick }: Props) {
  const initialValues = useMemo(() => {
    let result: { [index: string]: types.PermissionItem[] } = {};

    availableActions.forEach((action) => {
      let actionName = action.action.toString();
      result[actionName] = permissions
        .filter((permission) => permission.action === actionName)
        .map((permission) => ({
          roleId: permission.appRoleId,
          roleName: permission.appRole?.displayName || "",
          actionName: permission.action,
        }));
    });

    return result;
  }, [permissions, availableActions]);

  return <div onClick={onClick}>{JSON.stringify(entityPermissions)}</div>;
  /**todo:complete display */
}

export default EntityPermissions;
