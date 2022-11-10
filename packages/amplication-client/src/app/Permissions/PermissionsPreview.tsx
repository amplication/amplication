import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "../util/error";

import * as models from "../models";
import * as permissionsTypes from "./types";
import "./PermissionsPreview.scss";
import { preparePermissionsByAction } from "./permissionUtil";

type TData = {
  entity: models.Entity;
};

type Props = {
  entityId?: string;
  availableActions: permissionsTypes.PermissionAction[];
  entityDisplayName: string;
};

function PermissionsPreview({
  entityId,
  availableActions,
  entityDisplayName,
}: Props) {
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
    <div className="permissions-preview">
      {error ? (
        errorMessage
      ) : (
        <div className="permissions-preview__actions">
          {availableActions.map((action) => (
            <div
              key={action.action}
              className="permissions-preview__actions__action"
            >
              <h3>{action.action}</h3>
              <div>{entityDisplayName}</div>
              <div className="permissions-preview__actions__action__summary">
                {/**@todo: display the relevant message*/}
                {loading
                  ? "Loading..."
                  : permissionsByAction[action.action].type.toString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PermissionsPreview;

export const GET_ENTITY_PERMISSIONS = gql`
  query getEntityPermissionsPreview($id: String!) {
    entity(where: { id: $id }) {
      id
      permissions {
        id
        action
        type
        permissionRoles {
          id
          resourceRoleId
        }
      }
    }
  }
`;
