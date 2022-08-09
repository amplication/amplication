import React, { useCallback } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Snackbar } from "@amplication/design-system";

import { formatError } from "../util/error";
import RoleForm from "./RoleForm";
import * as models from "../models";

type TData = {
  resourceRole: models.ResourceRole;
};

const Role = () => {
  const match = useRouteMatch<{
    resource: string;
    roleId: string;
  }>("/:workspace/:project/:resource/roles/:roleId");

  const { roleId } = match?.params ?? {};

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

  return (
    <>
      {!loading && (
        <RoleForm onSubmit={handleSubmit} defaultValues={data?.resourceRole} />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Role;

const GET_ROLE = gql`
  query getResourceRole($roleId: String!) {
    resourceRole(where: { id: $roleId }) {
      id
      name
      displayName
      description
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation updateResourceRole(
    $data: ResourceRoleUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateResourceRole(data: $data, where: $where) {
      id
      name
      displayName
      description
    }
  }
`;
