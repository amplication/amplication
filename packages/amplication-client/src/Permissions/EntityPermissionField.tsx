import React, { useCallback, useMemo } from "react";
import * as models from "../models";

import { Button, EnumButtonStyle } from "../Components/Button";
import { Panel, EnumPanelStyle } from "../Components/Panel";
import { ActionRole } from "./ActionRole";

const CLASS_NAME = "entity-permission-fields";

type TData = {
  entity: models.Entity;
};

type Props = {
  actionDisplayName: string;
  field: models.EntityPermissionField;
  onDeleteField: (fieldName: string) => void;
  permission: models.EntityPermission;
};

export const EntityPermissionField = ({
  actionDisplayName,
  field,
  permission,
  onDeleteField,
}: Props) => {
  const availableRoles = useMemo((): models.AppRole[] => {
    if (!permission.permissionRoles) {
      return [];
    }

    return permission.permissionRoles.map((role) => role.appRole);
  }, [permission]);

  const selectedRoleIds = useMemo((): Set<string> => {
    /**@todo: convert selected EntityPermissionFieldRole[] to Set<Role> */
    return new Set();
  }, []);

  const handleDeleteField = useCallback(() => {
    onDeleteField(field.field.name);
  }, [onDeleteField, field]);

  const handleRoleSelectionChange = useCallback(
    ({ id, name }: models.AppRole, checked: boolean) => {
      if (checked) {
        /**@todo: complete add and remove */
      }
    },
    []
  );

  return (
    <Panel
      panelStyle={EnumPanelStyle.Bordered}
      className={`${CLASS_NAME}__field`}
    >
      <div className={`${CLASS_NAME}__header`}>
        <span>
          <span className={`${CLASS_NAME}__action-name`}>
            {actionDisplayName} Field
          </span>{" "}
          {field.field.name}
        </span>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="delete_outline"
          onClick={handleDeleteField}
        />
      </div>
      <hr className="panel-divider" />
      {availableRoles.map((role) => (
        <ActionRole
          key={role.id}
          role={role}
          onClick={handleRoleSelectionChange}
          selected={selectedRoleIds.has(role.id)}
        />
      ))}
    </Panel>
  );
};
