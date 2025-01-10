import {
  Button,
  CircularProgress,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React, { useMemo } from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import AddRolePermission from "./AddRolePermissionButton";
import useRoles from "./hooks/useRoles";
import { useAppContext } from "../context/appContext";

type Props = {
  role: models.Role;
  onPermissionRemoved?: (role: models.Role) => void;
  onPermissionAdded?: (role: models.Role) => void;
};

const RolePermissionList = React.memo(
  ({ role, onPermissionRemoved, onPermissionAdded }: Props) => {
    const {
      removePermissionsFromRole,
      removePermissionsFromRoleError,
      removePermissionsFromRoleLoading,
      addPermissionsToRole,
      addPermissionsToRoleError,
      addPermissionsToRoleLoading,
    } = useRoles(role?.id);

    const errorMessage = formatError(
      addPermissionsToRoleError || removePermissionsFromRoleError
    );

    const { permissions } = useAppContext();

    const canEditRole = permissions.canPerformTask("role.edit");

    const handleAddPermissions = (userIds: string[]) => {
      addPermissionsToRole(userIds);
      onPermissionRemoved && onPermissionAdded(role);
    };

    const handleRemovePermissions = (userId: string) => {
      removePermissionsFromRole([userId]);
      onPermissionRemoved && onPermissionRemoved(role);
    };

    const permissionCount = role?.permissions?.length || 0;
    const loading =
      addPermissionsToRoleLoading || removePermissionsFromRoleLoading;

    const orderedPermissions = useMemo(() => {
      return role?.permissions?.sort((a, b) => a.localeCompare(b));
    }, [role?.permissions]);

    return (
      <>
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          itemsAlign={EnumItemsAlign.Center}
          start={
            <Text textStyle={EnumTextStyle.Tag}>
              {permissionCount}{" "}
              {pluralize(permissionCount, "Permission", "Permissions")}
            </Text>
          }
          end={
            role &&
            canEditRole && (
              <AddRolePermission
                role={role}
                onAddPermissions={handleAddPermissions}
              />
            )
          }
        >
          {loading && <CircularProgress />}
        </FlexItem>
        <List>
          {orderedPermissions?.map((permission) => (
            <ListItem
              end={
                canEditRole && (
                  <Button
                    icon="trash_2"
                    buttonStyle={EnumButtonStyle.Text}
                    onClick={() => {
                      handleRemovePermissions(permission);
                    }}
                  />
                )
              }
              key={permission}
            >
              {permission}
            </ListItem>
          ))}
        </List>
        <Snackbar
          open={
            Boolean(addPermissionsToRoleError) ||
            Boolean(removePermissionsFromRoleError)
          }
          message={errorMessage}
        />
      </>
    );
  }
);

export default RolePermissionList;
