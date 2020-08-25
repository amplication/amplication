import React, { useMemo } from "react";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import keyBy from "lodash.keyby";
import "./PermissionsForm.scss";

import * as models from "../models";
import SidebarHeader from "../Layout/SidebarHeader";
import { EntityPermissionAction } from "./EntityPermissionAction";

import * as permissionsTypes from "./types";

type PermissionsInput = models.EntityPermission[];

type PermissionByActionName = {
  [actionName: string]: models.EntityPermission;
};

type Props = {
  permissions: PermissionsInput;
  availableActions: permissionsTypes.PermissionAction[];
  backUrl: string;
  applicationId: string;
  entityId: string;
  objectDisplayName: string;
};

const PermissionsForm = ({
  permissions,
  availableActions,
  backUrl,
  applicationId,
  entityId,
  objectDisplayName,
}: Props) => {
  const permissionsByAction = useMemo((): PermissionByActionName => {
    let defaultGroups = Object.fromEntries(
      availableActions.map((action) => [
        action.action.toString(),
        getDefaultEntityPermission(action.action),
      ])
    );

    let groupedValues = keyBy(permissions, (permission) => permission.action);

    return {
      ...defaultGroups,
      ...groupedValues,
    };
  }, [permissions, availableActions]);

  return (
    <div className="permissions-form">
      <SidebarHeader showBack backUrl={backUrl}>
        Permissions
      </SidebarHeader>
      <DrawerContent>
        <>
          {availableActions.map((action) => (
            <EntityPermissionAction
              entityId={entityId}
              permission={permissionsByAction[action.action]}
              applicationId={applicationId}
              permissionAction={action}
              entityDisplayName={objectDisplayName}
            />
          ))}
        </>
      </DrawerContent>
    </div>
  );
};

export default PermissionsForm;

/**
 * Returns an empty EntityPermission object to be used for Actions that were never saved
 */
function getDefaultEntityPermission(
  actionName: models.EnumEntityAction
): models.EntityPermission {
  return {
    id: "",
    type: models.EnumEntityPermissionType.Disabled,
    entityVersionId: "",
    action: actionName,
  };
}
