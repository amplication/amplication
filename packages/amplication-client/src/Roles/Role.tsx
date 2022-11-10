import { Snackbar } from "@amplication/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useContext } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import DeleteRoleButton from "./DeleteRoleButton";
import "./Role.scss";
import RoleForm from "./RoleForm";

type TData = {
  resourceRole: models.ResourceRole;
};

const CLASS_NAME = "role-page";

const Role = () => {
  const match = useRouteMatch<{
    resource: string;
    roleId: string;
  }>("/:workspace/:project/:resource/roles/:roleId");
  const history = useHistory();
  const { roleId, resource } = match?.params ?? {};
  const { currentWorkspace, currentProject } = useContext(AppContext);

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

  const handleDeleteRole = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resource}/roles`
    );
  }, [history, resource, currentWorkspace, currentProject]);

  return (
    <>
      {!loading && (
        <>
          <div className={`${CLASS_NAME}__header`}>
            <h3>{data?.resourceRole.displayName} role</h3>
            <DeleteRoleButton
              displayName={data?.resourceRole.displayName as string}
              resourceRoleId={data?.resourceRole.id as string}
              onDelete={handleDeleteRole}
            />
          </div>
          <RoleForm
            onSubmit={handleSubmit}
            defaultValues={data?.resourceRole}
          />
        </>
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
