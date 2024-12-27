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
import React from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import AddRolePermission from "./AddRolePermissionButton";
import useRoles from "./hooks/useRoles";

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
            role && (
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
          {role?.permissions?.map((permission) => (
            <ListItem
              end={
                <Button
                  icon="trash_2"
                  buttonStyle={EnumButtonStyle.Text}
                  onClick={() => {
                    handleRemovePermissions(permission);
                  }}
                />
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
