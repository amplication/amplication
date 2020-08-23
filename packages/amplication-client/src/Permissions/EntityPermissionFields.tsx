import React, { useCallback, useMemo } from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { remove, cloneDeep } from "lodash";

import { GET_ENTITY } from "../Entity/Entity";
import * as models from "../models";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
} from "../Components/SelectMenu";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Panel, EnumPanelStyle } from "../Components/Panel";
import "./EntityPermissionFields.scss";

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
  const selectedFieldIds = useMemo((): Set<string> => {
    return new Set(permission.fields?.map((field) => field.fieldId));
  }, [permission]);

  /**@todo: handle loading state and errors */
  const { data } = useQuery<TData>(GET_FIELDS, {
    variables: {
      id: entityId,
    },
  });

  /**@todo: handle  errors */
  const [addField] = useMutation(ADD_FIELD, {
    update(cache, { data: { addEntityPermissionField } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY,
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

      actionData.fields = actionData?.fields?.concat([
        addEntityPermissionField,
      ]);

      cache.writeQuery({
        query: GET_ENTITY,
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
    update(cache, { data: { deleteEntityPermissionField } }) {
      const queryData = cache.readQuery<{
        entity: models.Entity;
      }>({
        query: GET_ENTITY,
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
      if (!actionData || !actionData.fields) {
        return;
      }

      remove(
        actionData.fields,
        (field) => field.fieldId === deleteEntityPermissionField.fieldId
      );

      cache.writeQuery({
        query: GET_ENTITY,
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

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__add-field`}>
        Fields can have override permissions for special conditions
        <SelectMenu
          title="Add Field"
          icon="add"
          buttonStyle={EnumButtonStyle.Clear}
        >
          <SelectMenuModal>
            <SelectMenuList>
              {data?.entity?.fields?.map((field) => (
                <SelectMenuItem
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
      {permission.fields?.map((field) => (
        <Panel
          panelStyle={EnumPanelStyle.Bordered}
          className={`${CLASS_NAME}__field`}
        >
          <div className={`${CLASS_NAME}__header`}>
            <span>
              <span className={`${CLASS_NAME}__action-name`}>
                {actionDisplayName}
              </span>{" "}
              {field.field?.name}
            </span>
            <Button buttonStyle={EnumButtonStyle.Clear} icon="delete_outline" />
          </div>
        </Panel>
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
      fieldId
      field {
        id
        name
        displayName
      }
    }
  }
`;

const DELETE_FIELD = gql`
  mutation deleteEntityPermissionField(
    $fieldName: String!
    $entityId: String!
    $action: EnumEntityAction!
  ) {
    deleteEntityPermissionField(
      where: { action: $action, fieldName: $fieldName, entityId: $entityId }
    ) {
      fieldId
    }
  }
`;
