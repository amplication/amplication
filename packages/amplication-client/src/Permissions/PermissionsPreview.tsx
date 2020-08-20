import React from "react";

import * as models from "../models";
import * as permissionsTypes from "./types";
import "./PermissionsPreview.scss";

type Props = {
  permissions: models.EntityPermission[];
  availableActions: permissionsTypes.PermissionAction[];
  entityDisplayName: string;
};

function PermissionsPreview({
  permissions,
  availableActions,
  entityDisplayName,
}: Props) {
  return (
    <div className="permissions-preview">
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
