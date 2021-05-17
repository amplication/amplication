import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

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
  applicationId: string;
  entityId: string;
  objectDisplayName: string;
};

const PermissionsForm = ({
  availableActions,
  applicationId,
  entityId,
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
      {loading
        ? "Loading..."
        : availableActions.map((action) => (
            <EntityPermissionAction
              key={action.action}
              entityId={entityId}
              permission={permissionsByAction[action.action]}
              applicationId={applicationId}
              permissionAction={action}
              entityDisplayName={objectDisplayName}
            />
          ))}
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
          appRoleId
          appRole {
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
            appRole {
              id
              displayName
            }
          }
        }
      }
    }
  }
`;
