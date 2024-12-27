import {
  Button,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  SearchField,
  Text,
} from "@amplication/ui/design-system";
import { useMemo, useState } from "react";
import * as models from "../models";
import useRoles from "./hooks/useRoles";

type Props = {
  role: models.Role;
  onAddPermissions: (userIds: string[]) => void;
};

const CLASS_NAME = "add-role-permission";

const AddRolePermission = ({ role, onAddPermissions }: Props) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { rolesPermissionsList } = useRoles(role?.id);

  const handleSelectPermission = (userId: string) => {
    const checked = !selectedPermissions.includes(userId);

    if (checked) {
      setSelectedPermissions([...selectedPermissions, userId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== userId));
    }
  };

  const handleAddPermissions = () => {
    onAddPermissions(selectedPermissions);
  };

  const availableWorkspacePermissionsFiltered = useMemo(() => {
    const unusedPermissions = rolesPermissionsList.filter(
      (permission) => !role.permissions.includes(permission)
    );

    if (!searchPhrase) {
      return unusedPermissions;
    }

    const lowerSearchPhrase = searchPhrase.toLowerCase();

    return unusedPermissions.filter((permission) =>
      permission.toLowerCase().includes(lowerSearchPhrase)
    );
  }, [searchPhrase, rolesPermissionsList, role]);

  return (
    <>
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <SearchField
            label="search"
            placeholder="search"
            onChange={setSearchPhrase}
          />
        }
      ></FlexItem>
      <List className={CLASS_NAME}>
        {availableWorkspacePermissionsFiltered.map((permission) => (
          <ListItem
            onClick={() => {
              handleSelectPermission(permission);
            }}
            key={permission}
            start={
              <Icon
                icon={
                  selectedPermissions.includes(permission)
                    ? "check_square"
                    : "square"
                }
                color={
                  selectedPermissions.includes(permission)
                    ? EnumTextColor.ThemeGreen
                    : EnumTextColor.Black20
                }
              />
            }
          >
            {permission}
          </ListItem>
        ))}
      </List>
      <FlexItem
        margin={EnumFlexItemMargin.Top}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <Text textStyle={EnumTextStyle.Description}>
            {selectedPermissions.length
              ? `${selectedPermissions.length} selected`
              : ""}
          </Text>
        }
        end={
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            disabled={!selectedPermissions.length}
            onClick={handleAddPermissions}
          >
            Add Permissions
          </Button>
        }
      ></FlexItem>
    </>
  );
};

export default AddRolePermission;
