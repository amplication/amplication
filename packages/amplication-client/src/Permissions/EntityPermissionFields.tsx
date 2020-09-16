import React, { useCallback, useMemo, useContext } from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { remove, cloneDeep } from "lodash";

import { GET_ENTITY_PERMISSIONS } from "./PermissionsForm";
import * as models from "../models";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../Components/SelectMenu";
import { EntityPermissionField } from "./EntityPermissionField";
import { EnumButtonStyle } from "../Components/Button";
import "./EntityPermissionFields.scss";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

const CLASS_NAME = "entity-permission-fields";

type TData = {
  entity: models.Entity;
};

type Props = {
  actionName: models.EnumEntityAction;
  actionDisplayName: string;
  entityId: string;
  permission: models.EntityPermission;
};

export const EntityPermissionFields = ({
  actionName,
  actionDisplayName,
  entityId,
  permission,
}: Props) => {
  const pendingChangesContext = useContext(PendingChangesContext);

  const selectedFieldIds = useMemo((): Set<string> => {
    return new Set(permission.permissionFields?.map((field) => field.field.id));
  }, [permission.permissionFields]);

  /**@todo: handle loading state and errors */
  const { data } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
    },
  });

  /**@todo: handle  errors */
  const [addField] = useMutation(ADD_FIELD, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
    update(cache, { data: { addEntityPermissionField } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
      });
      if (queryData === null || !queryData.entity.permissions) {
        return;
      }
      const clonedQueryData = {
        entity: cloneDeep(queryData.entity),
      };

      const actionData = clonedQueryData.entity.permissions?.find(
        (p) => p.action === actionName
      );
      if (!actionData) {
        return;
      }

      actionData.permissionFields = actionData?.permissionFields?.concat([
        addEntityPermissionField,
      ]);

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
        data: {
          entity: {
            ...clonedQueryData.entity,
          },
        },
      });
    },
  });

  /**@todo: handle  errors */
  const [deleteField] = useMutation(DELETE_FIELD, {
    onCompleted: (data) => {
      pendingChangesContext.addEntity(entityId);
    },
    update(cache, { data: { deleteEntityPermissionField } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
      });
      if (queryData === null || !queryData.entity.permissions) {
        return;
      }
      const clonedQueryData = {
        entity: cloneDeep(queryData.entity),
      };

      const actionData = clonedQueryData.entity.permissions?.find(
        (p) => p.action === actionName
      );
      if (!actionData || !actionData.permissionFields) {
        return;
      }

      remove(
        actionData.permissionFields,
        (field) =>
          field.fieldPermanentId ===
          deleteEntityPermissionField.fieldPermanentId
      );

      cache.writeQuery({
        query: GET_ENTITY_PERMISSIONS,
        variables: {
          id: entityId,
        },
        data: {
          entity: {
            ...clonedQueryData.entity,
          },
        },
      });
    },
  });

  const handleFieldSelected = useCallback(
    ({ fieldName }) => {
      addField({
        variables: {
          fieldName: fieldName,
          entityId: entityId,
          action: actionName,
        },
      }).catch(console.error);
    },
    [addField, entityId, actionName]
  );

  const handleDeleteField = useCallback(
    (fieldPermanentId) => {
      deleteField({
        variables: {
          fieldPermanentId: fieldPermanentId,
          entityId: entityId,
          action: actionName,
        },
      }).catch(console.error);
    },
    [deleteField, entityId, actionName]
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__add-field`}>
        Set specific permissions to special fields
        <SelectMenu
          title="Add Field"
          icon="plus"
          buttonStyle={EnumButtonStyle.Clear}
        >
          <SelectMenuModal>
            <SelectMenuList>
              {data?.entity?.fields?.map((field) => (
                <SelectMenuItem
                  key={field.id}
                  selected={selectedFieldIds.has(field.id)}
                  onSelectionChange={handleFieldSelected}
                  itemData={{
                    fieldName: field.name,
                  }}
                >
                  {field.displayName}
                </SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </div>
      {permission.permissionFields?.map((field) => (
        <EntityPermissionField
          entityId={entityId}
          permission={permission}
          actionDisplayName={actionDisplayName}
          permissionField={field}
          onDeleteField={handleDeleteField}
        />
      ))}
    </div>
  );
};

const GET_FIELDS = gql`
  query getFields($id: String!) {
    entity(where: { id: $id }) {
      id
      fields {
        id
        name
        displayName
      }
    }
  }
`;

const ADD_FIELD = gql`
  mutation addEntityPermissionField(
    $fieldName: String!
    $entityId: String!
    $action: EnumEntityAction!
  ) {
    addEntityPermissionField(
      data: {
        action: $action
        fieldName: $fieldName
        entity: { connect: { id: $entityId } }
      }
    ) {
      id
      fieldPermanentId
      field {
        id
        name
        displayName
      }
      permissionFieldRoles {
        id
        appRole {
          id
          displayName
        }
      }
    }
  }
`;

const DELETE_FIELD = gql`
  mutation deleteEntityPermissionField(
    $fieldPermanentId: String!
    $entityId: String!
    $action: EnumEntityAction!
  ) {
    deleteEntityPermissionField(
      where: {
        action: $action
        fieldPermanentId: $fieldPermanentId
        entityId: $entityId
      }
    ) {
      id
      fieldPermanentId
    }
  }
`;
