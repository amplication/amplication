import React, { useCallback, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Snackbar } from "@amplication/design-system";

import { formatError } from "../util/error";
import DeleteRoleField from "./DeleteRoleField";
import RoleForm from "./RoleForm";
import * as models from "../models";

import "./Role.scss";

type TData = {
  appRole: models.AppRole;
};

const CLASS_NAME = "role";

const Role = () => {
  const history = useHistory();
  const match = useRouteMatch<{
    application: string;
    roleId: string;
  }>("/:application/roles/:roleId");

  const { roleId, application } = match?.params ?? {};

  const [error, setError] = useState<Error>();

  const { data, error: loadingError, loading } = useQuery<TData>(GET_ROLE, {
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

  const hasError = Boolean(error) || Boolean(updateError) || Boolean(loadingError);
  const errorMessage = formatError(error) || formatError(updateError) || formatError(loadingError);

  const handleDeleteRole = useCallback(() => {
    history.push(`/${application}/roles`);
  }, [history, application]);

  return (
    <>
      {!loading && (
        <>
          <div className={`${CLASS_NAME}__header`}>
            <h3>Role Settings</h3>
            <DeleteRoleField
              appRole={data?.appRole}
              onError={setError}
              onDelete={handleDeleteRole}
              showLabel
            />
          </div>
          <RoleForm onSubmit={handleSubmit} defaultValues={data?.appRole} />
        </>
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
