import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

import {
  CircularProgress,
  EnumTextColor,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";

import "./PermissionsForm.scss";

import { formatError } from "../util/error";
import * as models from "../models";
import { EntityPermissionAction } from "./EntityPermissionAction";
import { preparePermissionsByAction } from "./permissionUtil";

import * as permissionsTypes from "./types";

type TData = {
  entity: models.Entity;
};

type Props = {
  availableActions: permissionsTypes.PermissionAction[];
  resourceId: string;
  entityId: string;
  entityName: string;
  objectDisplayName: string;
};

const PermissionsForm = ({
  availableActions,
  resourceId,
  entityId,
  entityName,
  objectDisplayName,
}: Props) => {
  const { data, loading, error } = useQuery<TData>(GET_ENTITY_PERMISSIONS, {
    variables: {
      id: entityId,
    },
  });
  const errorMessage = formatError(error);

  const permissionsByAction = useMemo(() => {
    return preparePermissionsByAction(
      availableActions,
      data?.entity.permissions
    );
  }, [data, availableActions]);

  return (
    <div className="permissions-form">
      <Text textColor={EnumTextColor.Primary}>{`${entityName} entity`}</Text>
      <TabContentTitle
        title="Entity Permissions"
        subTitle="Set the access permissions for the various actions and fields of the entity"
      />

      {loading ? (
        <CircularProgress centerToParent />
      ) : (
        availableActions.map((action) => (
          <EntityPermissionAction
            key={action.action}
            entityId={entityId}
            permission={permissionsByAction[action.action]}
            resourceId={resourceId}
            permissionAction={action}
            entityDisplayName={objectDisplayName}
          />
        ))
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default PermissionsForm;

export const GET_ENTITY_PERMISSIONS = gql`
  query getEntityPermissions($id: String!) {
    entity(where: { id: $id }) {
      id
      permissions {
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
          permissionRoles {
            id
            resourceRole {
              id
              displayName
            }
          }
        }
      }
    }
  }
`;
