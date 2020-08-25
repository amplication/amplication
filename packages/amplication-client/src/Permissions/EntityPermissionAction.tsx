import React, { useCallback, useMemo } from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { isEmpty, cloneDeep } from "lodash";
import difference from "@extra-set/difference";

import "./EntityPermissionAction.scss";
import * as models from "../models";
import * as permissionTypes from "../Permissions/types";
import { MultiStateToggle } from "../Components/MultiStateToggle";
import { ActionRoleList } from "./ActionRoleList";
import { EntityPermissionFields } from "./EntityPermissionFields";
import { Toggle } from "../Components/Toggle";
import {
  Panel,
  EnumPanelStyle,
  PanelExpandableBottom,
} from "../Components/Panel";
import { GET_ENTITY_PERMISSIONS } from "./PermissionsForm";

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
  permissionAction: permissionTypes.PermissionAction;
  entityDisplayName: string;
  applicationId: string;
};

export const EntityPermissionAction = ({
  entityId,
  permission,
  permissionAction: { action: actionName, actionDisplayName, canSetFields },
  entityDisplayName,
  applicationId,
}: Props) => {
  const selectedRoleIds = useMemo((): Set<string> => {
    return new Set(permission.permissionRoles?.map((role) => role.appRoleId));
  }, [permission.permissionRoles]);

  /**@todo: handle  errors */
  const [updatePermission] = useMutation(UPDATE_PERMISSION);

  /**@todo: handle  errors */
  const [updateRole] = useMutation(UPDATE_ROLES, {
    update(cache, { data: { updateEntityPermissionRoles } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY_PERMISSIONS,
        variables: { id: entityId },
      });
      if (queryData === null || !queryData.entity.permissions) {
        return;
      }
      const clonedQueryData = cloneDeep(queryData.entity);

      const allOtherActions = clonedQueryData.permissions?.filter(
        (p) => p.action !== actionName
      );

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: { id: entityId },
        data: {
          entity: {
            ...clonedQueryData,
            permissions: allOtherActions?.concat([updateEntityPermissionRoles]),
          },
        },
      });
    },
  });

  const handleRoleSelectionChange = useCallback(
    (newSelectedRoleIds: Set<string>) => {
      const addedRoleIds = difference(newSelectedRoleIds, selectedRoleIds);
      const removedRoleIds = difference(selectedRoleIds, newSelectedRoleIds);

      const addRoles = Array.from(addedRoleIds, (id) => ({
        id,
      }));

      const deleteRoles = Array.from(removedRoleIds, (id) => ({
        id,
      }));

      updateRole({
        variables: {
          entityId: entityId,
          action: actionName,
          deleteRoles: deleteRoles,
          addRoles: addRoles,
        },
      }).catch(console.error);
    },
    [selectedRoleIds, actionName, entityId, updateRole]
  );

  /**@todo: handle loading state and errors */
  const { data } = useQuery<TData>(GET_ROLES, {
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
          /**Refetch all the entity's permissions only when saving the action for the first time (permission.id is empty) */
          if (isEmpty(permission.id)) {
            return [
              {
                query: GET_ENTITY_PERMISSIONS,
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
              ? `${selectedRoleIds.size} roles selected`
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
        <ActionRoleList
          availableRoles={data?.appRoles || []}
          selectedRoleIds={selectedRoleIds}
          debounceMS={1000}
          onChange={handleRoleSelectionChange}
        />
      </PanelExpandableBottom>
      {canSetFields &&
        permission.type !== models.EnumEntityPermissionType.Disabled && (
          <EntityPermissionFields
            actionName={actionName}
            actionDisplayName={actionDisplayName}
            entityId={entityId}
            permission={permission}
          />
        )}
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

const UPDATE_ROLES = gql`
  mutation addEntityPermissionRole(
    $entityId: String!
    $action: EnumEntityAction!
    $deleteRoles: [WhereUniqueInput!]
    $addRoles: [WhereUniqueInput!]
  ) {
    updateEntityPermissionRoles(
      data: {
        action: $action
        entity: { connect: { id: $entityId } }
        deleteRoles: $deleteRoles
        addRoles: $addRoles
      }
    ) {
      id
      action
      type
      roles {
        appRoleId
        appRole {
          id
          displayName
        }
      }
      fields {
        fieldId
        field {
          id
          name
          displayName
        }
      }
    }
  }
`;
