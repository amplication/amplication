import React, { useCallback, useMemo, useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { isEmpty, cloneDeep } from "lodash";
import difference from "@extra-set/difference";

import "./EntityPermissionAction.scss";
import * as models from "../models";
import * as permissionTypes from "../Permissions/types";
import {
  MultiStateToggle,
  PanelCollapsible,
  Toggle,
  Icon,
} from "@amplication/design-system";
import { ActionRoleList } from "./ActionRoleList";
import { EntityPermissionFields } from "./EntityPermissionFields";
import { GET_ENTITY_PERMISSIONS } from "./PermissionsForm";
import { GET_ROLES } from "../Roles/RoleList";
import { AppContext } from "../context/appContext";

const CLASS_NAME = "entity-permissions-action";
type TData = {
  resourceRoles: models.ResourceRole[];
};

const OPTIONS = [
  { value: models.EnumEntityPermissionType.Public, label: "Public" },
  { value: models.EnumEntityPermissionType.AllRoles, label: "All Roles" },
  { value: models.EnumEntityPermissionType.Granular, label: "Granular" },
];

type Props = {
  entityId: string;
  permission: models.EntityPermission;
  permissionAction: permissionTypes.PermissionAction;
  entityDisplayName: string;
  resourceId: string;
};

export const EntityPermissionAction = ({
  entityId,
  permission,
  permissionAction: { action: actionName, actionDisplayName, canSetFields },
  entityDisplayName,
  resourceId,
}: Props) => {
  const { addEntity } = useContext(AppContext);

  const selectedRoleIds = useMemo((): Set<string> => {
    return new Set(
      permission.permissionRoles?.map((role) => role.resourceRoleId)
    );
  }, [permission.permissionRoles]);

  /**@todo: handle  errors */
  const [updatePermission] = useMutation(UPDATE_PERMISSION, {
    onCompleted: (data) => {
      addEntity(entityId);
    },
  });

  /**@todo: handle  errors */
  const [updateRole] = useMutation(UPDATE_ROLES, {
    onCompleted: (data) => {
      addEntity(entityId);
    },
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
      id: resourceId,
      orderBy: undefined,
      whereName: undefined,
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
  const isOpen = permission.type === models.EnumEntityPermissionType.Granular;

  return (
    <PanelCollapsible
      initiallyOpen
      collapseEnabled={isOpen}
      manualCollapseDisabled
      className={CLASS_NAME}
      headerContent={
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
            <h4>
              <Icon icon="lock" />
              {permission.type === models.EnumEntityPermissionType.AllRoles ? (
                <span className={`${CLASS_NAME}__action-summary`}>
                  All roles selected
                </span>
              ) : permission.type ===
                models.EnumEntityPermissionType.Granular ? (
                <span className={`${CLASS_NAME}__action-summary`}>
                  {selectedRoleIds.size} roles selected
                </span>
              ) : permission.type === models.EnumEntityPermissionType.Public ? (
                <span className={`${CLASS_NAME}__action-summary`}>
                  This action is public
                </span>
              ) : (
                <span className={`${CLASS_NAME}__action-summary--muted`}>
                  This action is disabled
                </span>
              )}
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
      }
    >
      <ul className="panel-list">
        <li>
          <ActionRoleList
            availableRoles={data?.resourceRoles || []}
            selectedRoleIds={selectedRoleIds}
            debounceMS={1000}
            onChange={handleRoleSelectionChange}
          />
        </li>
        <li>
          {canSetFields &&
            permission.type !== models.EnumEntityPermissionType.Disabled && (
              <EntityPermissionFields
                actionName={actionName}
                actionDisplayName={actionDisplayName}
                entityId={entityId}
                permission={permission}
              />
            )}
        </li>
      </ul>
    </PanelCollapsible>
  );
};

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
  mutation updateEntityPermissionRoles(
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
      permissionRoles {
        id
        resourceRoleId
        resourceRole {
          id
          displayName
        }
      }
      permissionFields {
        id
        fieldPermanentId
        field {
          id
          name
          displayName
        }
      }
    }
  }
`;
