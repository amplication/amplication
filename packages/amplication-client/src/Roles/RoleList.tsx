import {
  Chip,
  CircularProgress,
  EnumChipStyle,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  List,
  ListItem,
  SearchField,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useRoles from "./hooks/useRoles";
import NewRole from "./NewRole";
import BetaFeatureTag from "../Components/BetaFeatureTag";

const CLASS_NAME = "role-list";

export const RoleList = React.memo(() => {
  const { currentWorkspace, permissions } = useAppContext();

  const canCreate = permissions.canPerformTask("role.create");

  const baseUrl = `/${currentWorkspace?.id}/settings`;

  const {
    setSearchPhrase,
    findRolesData: data,
    findRolesError: error,
    findRolesLoading: loading,
  } = useRoles();

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );
  const history = useHistory();

  const errorMessage = formatError(error);

  const handleRoleChange = useCallback(
    (role: models.Role) => {
      const fieldUrl = `${baseUrl}/roles/${role.id}`;
      history.push(fieldUrl);
    },
    [history, baseUrl]
  );

  return (
    <div className={CLASS_NAME}>
      <TabContentTitle title="Roles" />

      <FlexItem
        itemsAlign={EnumItemsAlign.End}
        end={
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <BetaFeatureTag
              children="
              Roles are still in beta. Some features may be missing or incomplete.
              For complete functionality, please use the default Admin role ."
            />

            <SearchField
              label="search"
              placeholder="search"
              onChange={handleSearchChange}
            />
          </FlexItem>
        }
      >
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.roles.length || "0"}{" "}
          {pluralize(data?.roles.length, "Role", "Roles")}
        </Text>
        {loading && <CircularProgress />}
      </FlexItem>

      <HorizontalRule />

      <List
        headerContent={
          canCreate && (
            <NewRole disabled={!data?.roles} onRoleAdd={handleRoleChange} />
          )
        }
      >
        {data?.roles?.map((role) => (
          <ListItem
            to={`${baseUrl}/roles/${role.id}`}
            start={<Icon icon="roles_outline" />}
          >
            <FlexItem
              singeChildWithEllipsis
              itemsAlign={EnumItemsAlign.Center}
              end={
                <FlexItem
                  direction={EnumFlexDirection.Row}
                  itemsAlign={EnumItemsAlign.Center}
                >
                  {role.permissions.includes("*") && (
                    <Chip chipStyle={EnumChipStyle.ThemeBlue}>Admin</Chip>
                  )}
                  <Text textStyle={EnumTextStyle.Description}>
                    {role.permissions.length}{" "}
                    {pluralize(
                      role.permissions.length,
                      "Permission",
                      "Permissions"
                    )}
                  </Text>
                </FlexItem>
              }
            >
              <Text textStyle={EnumTextStyle.Description}>{role.name}</Text>
            </FlexItem>
          </ListItem>
        ))}
      </List>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
