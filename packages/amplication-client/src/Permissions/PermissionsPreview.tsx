import React from "react";

import * as models from "../models";
import * as permissionsTypes from "./types";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./PermissionsPreview.scss";

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
  return (
    <div className="permissions-preview">
      <div className="permissions-preview__title">
        <h2>Permissions</h2>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="edit"
          onClick={onClick}
        ></Button>
      </div>
      <div className="permissions-preview__actions">
        {availableActions.map((action) => (
          <div className="permissions-preview__actions__action">
            <h3>{action.action}</h3>
            <div>{entityDisplayName}</div>
            <div className="permissions-preview__actions__action__summary">
              {/**@todo: display the relevant message*/}
              All Users selected
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  /**todo:complete display */
}

export default PermissionsPreview;
