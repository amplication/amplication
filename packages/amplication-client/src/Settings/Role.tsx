import React, { useCallback, useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import { formatError } from "../util/error";
import RoleForm from "./RoleForm";
import * as models from "../models";
import SidebarHeader from "../Layout/SidebarHeader";

type TData = {
  appRole: models.AppRole;
};

const Role = () => {
  const match = useRouteMatch<{
    application: string;
    roleId: string;
  }>("/:application/settings/roles/:roleId");

  const { application, roleId } = match?.params ?? {};

  const { data, error, loading } = useQuery<TData>(GET_ROLE, {
    variables: {
      roleId,
    },
  });

  const [updateRole, { error: updateError }] = useMutation(UPDATE_ROLE);

  const handleSubmit = useCallback(
    (data) => {
      updateRole({
        variables: {
          where: {
            id: roleId,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateRole, roleId]
  );

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  const defaultValues = useMemo(
    () =>
      data?.appRole && {
        ...data?.appRole,
      },
    [data]
  );

  return (
    <>
      <SidebarHeader showBack backUrl={`/${application}/settings/roles/`}>
        {loading ? "Loading..." : `${data?.appRole.displayName} `}
      </SidebarHeader>
      {!loading && (
        <DrawerContent>
          <RoleForm onSubmit={handleSubmit} defaultValues={defaultValues} />
        </DrawerContent>
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Role;

const GET_ROLE = gql`
  query getAppRole($roleId: String!) {
    appRole(where: { id: $roleId }) {
      id
      name
      displayName
      description
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation updateAppRole(
    $data: AppRoleUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateAppRole(data: $data, where: $where) {
      id
      name
      displayName
      description
    }
  }
`;
