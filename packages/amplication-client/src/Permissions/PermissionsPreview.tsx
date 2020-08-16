import React, { useMemo } from "react";
import * as models from "../models";
import * as permissionsTypes from "./types";

type Props = {
  permissions: models.EntityPermission[];
  availableActions: permissionsTypes.PermissionAction[];
  onClick: () => void;
  entityDisplayName: string;
};

function PermissionsPreview({
  permissions,
  availableActions,
  entityDisplayName,
  onClick,
}: Props) {
  const permissionGroups = useMemo(() => {
    let result: { [index: string]: permissionsTypes.PermissionItem[] } = {};

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

  return (
    <div className="permissions-preview" onClick={onClick}>
      {availableActions.map((action) => (
        <div className="permissions-preview__action">
          <span>{action.action} </span>
          {entityDisplayName}
        </div>
      ))}
    </div>
  );
  /**todo:complete display */
}

export default PermissionsPreview;
