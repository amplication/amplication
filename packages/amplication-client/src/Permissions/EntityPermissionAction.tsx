import React, { useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import "./EntityPermissionAction.scss";
import * as models from "../models";
import { MultiStateToggle } from "../Components/MultiStateToggle";
import * as permissionsTypes from "../Permissions/types";
import { EnumButtonStyle } from "../Components/Button";
import { Button } from "../Components/Button";
import { Toggle } from "../Components/Toggle";
import {
  Panel,
  EnumPanelStyle,
  PanelExpandableBottom,
} from "../Components/Panel";

const CLASS_NAME = "entity-permissions-action";
type TData = {
  appRoles: models.AppRole[];
};

const OPTIONS = [
  { value: models.EnumEntityPermissionType.AllRoles, label: "All Roles" },
  { value: models.EnumEntityPermissionType.Granular, label: "Granular" },
];

type Props = {
  permission: models.EntityPermission;
  actionName: string;
  actionDisplayName: string;
  entityDisplayName: string;
  applicationId: string;
};

export const EntityPermissionAction = ({
  permission,
  actionName,
  actionDisplayName,
  entityDisplayName,
  applicationId,
}: Props) => {
  const handleRoleSelectionChange = useCallback(
    ({ roleId, roleName }: permissionsTypes.PermissionItem) => {},
    []
  );

  /**@todo: handle loading state and errors */
  const { data, loading } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: applicationId,
    },
  });

  const handleOnChangeType = useCallback((type) => {}, []);

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__header`}>
        <div>
          <Toggle
            title="enable action"
            checked={
              permission.type !== models.EnumEntityPermissionType.Disabled
            }
          />
        </div>
        <div className={`${CLASS_NAME}__header__title`}>
          <h3>
            <span className={`${CLASS_NAME}__action-name`}>
              {actionDisplayName}
            </span>{" "}
            {entityDisplayName}
          </h3>
          <h4 className="text-muted">
            {permission.type === models.EnumEntityPermissionType.AllRoles
              ? "All roles selected"
              : permission.type === models.EnumEntityPermissionType.Granular
              ? `${3} roles selected`
              : "This action is disabled"}
          </h4>
        </div>
        <div>
          {permission.type !== models.EnumEntityPermissionType.Disabled && (
            <MultiStateToggle
              label=""
              name="action_"
              options={OPTIONS}
              onChange={handleOnChangeType}
              selectedValue={permission.type}
            />
          )}
        </div>
      </div>

      <PanelExpandableBottom
        isOpen={permission.type === models.EnumEntityPermissionType.Granular}
      >
        {data?.appRoles?.map((item) => (
          <span className="entity-permissions-action__role">
            {item.displayName}
            <Button icon="close" buttonStyle={EnumButtonStyle.Clear}></Button>
          </span>
        ))}
      </PanelExpandableBottom>
    </Panel>
  );
};

export const GET_ROLES = gql`
  query getRoles($id: String!, $whereName: StringFilter) {
    appRoles(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: { displayName: asc }
    ) {
      id
      displayName
    }
  }
`;
