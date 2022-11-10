import React, { useCallback, useMemo, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import difference from "@extra-set/difference";
import { cloneDeep } from "lodash";

import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Panel, EnumPanelStyle, PanelHeader } from "@amplication/design-system";
import { ActionRoleList } from "./ActionRoleList";
import { GET_ENTITY_PERMISSIONS } from "./PermissionsForm";
import { AppContext } from "../context/appContext";

const CLASS_NAME = "entity-permission-fields";

type Props = {
  entityId: string;
  actionDisplayName: string;
  permissionField: models.EntityPermissionField;
  onDeleteField: (fieldName: string) => void;
  permission: models.EntityPermission;
};

export const EntityPermissionField = ({
  entityId,
  actionDisplayName,
  permissionField,
  permission,
  onDeleteField,
}: Props) => {
  const { addEntity } = useContext(AppContext);
  const availableRoles = useMemo((): models.ResourceRole[] => {
    if (!permission.permissionRoles) {
      return [];
    }

    return permission.permissionRoles.map((role) => role.resourceRole);
  }, [permission]);

  const selectedRoleIds = useMemo((): Set<string> => {
    return new Set(
      permissionField.permissionRoles?.map((item) => item.resourceRole.id)
    );
  }, [permissionField.permissionRoles]);

  /**@todo: handle  errors */
  const [updateRole] = useMutation(UPDATE_ROLES, {
    onCompleted: (data) => {
      addEntity(entityId);
    },
    update(cache, { data: { updateEntityPermissionFieldRoles } }) {
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

      const currentAction = clonedQueryData.permissions?.find(
        (p) => p.action === permission.action
      );

      if (!currentAction) {
        return;
      }

      // Find and update the changed field in the cache
      const updateFieldIndex = (currentAction.permissionFields || []).findIndex(
        (item) => item.id === permissionField.id
      );
      if (updateFieldIndex !== -1) {
        currentAction.permissionFields?.splice(
          updateFieldIndex,
          1,
          updateEntityPermissionFieldRoles
        );
      }

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: { id: entityId },
        data: {
          entity: clonedQueryData,
        },
      });
    },
  });

  const handleDeleteField = useCallback(() => {
    onDeleteField(permissionField.fieldPermanentId);
  }, [onDeleteField, permissionField.fieldPermanentId]);

  const handleRoleSelectionChange = useCallback(
    (newSelectedRoleIds: Set<string>) => {
      const addedRoleIds = difference(newSelectedRoleIds, selectedRoleIds);
      const removedRoleIds = difference(selectedRoleIds, newSelectedRoleIds);

      const addPermissionRoles = Array.from(addedRoleIds, (id) => {
        const permissionRole = permission.permissionRoles?.find(
          (item) => item.resourceRoleId === id
        );
        return {
          id: permissionRole?.id,
        };
      });

      const deletePermissionRoles = Array.from(removedRoleIds, (id) => {
        const permissionRole = permission.permissionRoles?.find(
          (item) => item.resourceRoleId === id
        );
        return {
          id: permissionRole?.id,
        };
      });

      updateRole({
        variables: {
          permissionFieldId: permissionField.id,
          deletePermissionRoles: deletePermissionRoles,
          addPermissionRoles: addPermissionRoles,
        },
      }).catch(console.error);
    },
    [
      selectedRoleIds,
      permission.permissionRoles,
      permissionField.id,
      updateRole,
    ]
  );

  return (
    <Panel
      panelStyle={EnumPanelStyle.Bordered}
      className={`${CLASS_NAME}__field`}
    >
      <PanelHeader className={`${CLASS_NAME}__header`}>
        <span>
          <span className={`${CLASS_NAME}__action-name`}>
            {actionDisplayName} Field
          </span>{" "}
          {permissionField.field.name}
        </span>
        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="trash_2"
          onClick={handleDeleteField}
        />
      </PanelHeader>
      <ActionRoleList
        availableRoles={availableRoles}
        selectedRoleIds={selectedRoleIds}
        debounceMS={1000}
        onChange={handleRoleSelectionChange}
      />
    </Panel>
  );
};

const UPDATE_ROLES = gql`
  mutation updateEntityPermissionFieldRoles(
    $permissionFieldId: String!
    $deletePermissionRoles: [WhereUniqueInput!]
    $addPermissionRoles: [WhereUniqueInput!]
  ) {
    updateEntityPermissionFieldRoles(
      data: {
        permissionField: { connect: { id: $permissionFieldId } }
        deletePermissionRoles: $deletePermissionRoles
        addPermissionRoles: $addPermissionRoles
      }
    ) {
      id
      fieldPermanentId
      field {
        id
        name
        displayName
      }
      permissionRoles {
        id
        resourceRole {
          id
          displayName
        }
      }
    }
  }
`;
