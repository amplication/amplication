import {
  FlexItem,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { formatError } from "../util/error";
import useRoles from "./hooks/useRoles";
import RoleForm from "./RoleForm";
import { DeleteRole } from "./DeleteRole";
import { useAppContext } from "../context/appContext";
import RolePermissionList from "./RolePermissionList";

const Role = () => {
  const match = useRouteMatch<{
    roleId: string;
  }>(["/:workspace/settings/roles/:roleId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}/settings`;
  const history = useHistory();

  const { roleId } = match?.params ?? {};

  const {
    getRoleData: data,
    getRoleError: error,
    getRoleLoading: loading,
    updateRole,
    updateRoleError: updateError,
  } = useRoles(roleId);

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

  const handleDeleteModule = useCallback(() => {
    history.push(`${baseUrl}/roles`);
  }, [history, baseUrl]);

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.role?.name}
          subTitle={data?.role?.description}
        />
        <FlexItem.FlexEnd>
          {data?.role && (
            <DeleteRole role={data?.role} onDelete={handleDeleteModule} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {!loading && (
        <RoleForm onSubmit={handleSubmit} defaultValues={data?.role} />
      )}
      <TabContentTitle
        title="Permissions"
        subTitle="Add or remove role permissions"
      />
      <RolePermissionList role={data?.role} />
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Role;
