import React, { useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import "./PermissionsForm.scss";

import { formatError } from "../util/error";
import * as models from "../models";
import SidebarHeader from "../Layout/SidebarHeader";
import { EntityPermissionAction } from "./EntityPermissionAction";
import { preparePermissionsByAction } from "./permissionUtil";

import * as permissionsTypes from "./types";

type TData = {
  entity: models.Entity;
};

type Props = {
  availableActions: permissionsTypes.PermissionAction[];
  backUrl: string;
  applicationId: string;
  entityId: string;
  objectDisplayName: string;
};

const PermissionsForm = ({
  availableActions,
  backUrl,
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
      <SidebarHeader showBack backUrl={backUrl}>
        Permissions
      </SidebarHeader>
      <DrawerContent>
        {loading ? (
          "Loading..."
        ) : (
          <>
            {availableActions.map((action) => (
              <EntityPermissionAction
                key={action.action}
                entityId={entityId}
                permission={permissionsByAction[action.action]}
                applicationId={applicationId}
                permissionAction={action}
                entityDisplayName={objectDisplayName}
              />
            ))}
          </>
        )}
      </DrawerContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default PermissionsForm;

export const GET_ENTITY_PERMISSIONS = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
      id
      permissions {
        id
        action
        type
        roles {
          appRoleId
        }
      }
    }
  }
`;
