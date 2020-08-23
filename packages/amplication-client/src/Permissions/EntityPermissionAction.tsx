import React, { useCallback } from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { isEmpty } from "lodash";

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
import { GET_ENTITY } from "../Entity/Entity";

const CLASS_NAME = "entity-permissions-action";
type TData = {
  appRoles: models.AppRole[];
};

const OPTIONS = [
  { value: models.EnumEntityPermissionType.AllRoles, label: "All Roles" },
  { value: models.EnumEntityPermissionType.Granular, label: "Granular" },
];

type Props = {
  entityId: string;
  permission: models.EntityPermission;
  actionName: string;
  actionDisplayName: string;
  entityDisplayName: string;
  applicationId: string;
};

export const EntityPermissionAction = ({
  entityId,
  permission,
  actionName,
  actionDisplayName,
  entityDisplayName,
  applicationId,
}: Props) => {
  /**@todo: handle  errors */
  const [updatePermission, { error: updateError }] = useMutation(
    UPDATE_PERMISSION
  );

  const handleRoleSelectionChange = useCallback(
    ({ roleId, roleName }: permissionsTypes.PermissionItem) => {
      /**@todo: handle  selection */
    },
    []
  );

  /**@todo: handle loading state and errors */
  const { data, loading } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: applicationId,
    },
  });

  const handleChangeType = useCallback(
    (type) => {
      updatePermission({
        variables: {
          data: {
            action: actionName,
            type: type,
          },
          where: {
            id: entityId,
          },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateEntityPermission: {
            id: permission.id,
            __typename: "EntityPermission",
            type: type,
            action: actionName,
          },
        },
      }).catch(console.error);
    },
    [updatePermission, entityId, actionName, permission.id]
  );

  const handleDisableChange = useCallback(
    (checked: boolean) => {
      const type = checked
        ? models.EnumEntityPermissionType.AllRoles
        : models.EnumEntityPermissionType.Disabled;
      updatePermission({
        variables: {
          data: {
            action: actionName,
            type: type,
          },
          where: {
            id: entityId,
          },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateEntityPermission: {
            id: permission.id,
            __typename: "EntityPermission",
            type: type,
            action: actionName,
          },
        },

        refetchQueries: () => {
          /**Refetch all tne entity's permissions only when  saving the action for the first time (permission.id is empty) */
          if (isEmpty(permission.id)) {
            return [
              {
                query: GET_ENTITY,
                variables: { id: entityId },
              },
            ];
          } else {
            return [];
          }
        },
      }).catch(console.error);
    },
    [updatePermission, entityId, actionName, permission.id]
  );

  return (
    <Panel className={CLASS_NAME} panelStyle={EnumPanelStyle.Bordered}>
      <div className={`${CLASS_NAME}__header`}>
        <div>
          <Toggle
            title="enable action"
            onValueChange={handleDisableChange}
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
              onChange={handleChangeType}
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

const UPDATE_PERMISSION = gql`
  mutation updateEntityPermission(
    $data: EntityUpdatePermissionInput!
    $where: WhereUniqueInput!
  ) {
    updateEntityPermission(data: $data, where: $where) {
      id
      action
      type
    }
  }
`;
