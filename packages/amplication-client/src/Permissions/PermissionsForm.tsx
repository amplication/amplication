import React from "react";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

import "./PermissionsForm.scss";

import * as models from "../models";
import SidebarHeader from "../Layout/SidebarHeader";
import { EntityPermissionAction } from "./EntityPermissionAction";

import * as permissionsTypes from "./types";

type PermissionsInput = models.EntityPermission[];

type Props = {
  permissions: PermissionsInput;
  availableActions: permissionsTypes.PermissionAction[];
  backUrl: string;
  applicationId: string;
  objectDisplayName: string;
};

const PermissionsForm = ({
  permissions,
  availableActions,
  backUrl,
  applicationId,
  objectDisplayName,
}: Props) => {
  return (
    <div className="permissions-form">
      <SidebarHeader showBack backUrl={backUrl}>
        Permissions
      </SidebarHeader>
      <DrawerContent>
        <>
          {availableActions.map((action) => (
            <EntityPermissionAction
              permission={
                permissions.find((p) => p.action === action.action) ||
                permissions[0]
              }
              applicationId={applicationId}
              actionName={action.action}
              actionDisplayName={action.actionDisplayName}
              entityDisplayName={objectDisplayName}
            />
          ))}
        </>
      </DrawerContent>
    </div>
  );
};

export default PermissionsForm;
