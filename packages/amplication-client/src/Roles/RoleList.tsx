import {
  CircularProgress,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useRoles from "./hooks/useRoles";
import NewRole from "./NewRole";

const CLASS_NAME = "role-list";

export const RoleList = React.memo(() => {
  const { currentWorkspace } = useAppContext();

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
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        end={loading && <CircularProgress centerToParent />}
      >
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.roles.length || "0"}{" "}
          {pluralize(data?.roles.length, "Role", "Roles")}
        </Text>
      </FlexItem>
      {<NewRole disabled={!data?.roles} onRoleAdd={handleRoleChange} />}
      <HorizontalRule />
      <SearchField
        label="search"
        placeholder="search"
        onChange={handleSearchChange}
      />

      <FlexItem
        margin={EnumFlexItemMargin.Top}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
        gap={EnumGapSize.None}
      >
        {data?.roles?.map((role) => (
          <InnerTabLink icon="roles" to={`${baseUrl}/roles/${role.id}`}>
            <FlexItem
              singeChildWithEllipsis
              itemsAlign={EnumItemsAlign.Center}
              end={
                <Text textStyle={EnumTextStyle.Description}>
                  {role.permissions.length}{" "}
                  {pluralize(
                    role.permissions.length,
                    "Permission",
                    "Permissions"
                  )}
                </Text>
              }
            >
              <span>{role.name}</span>
            </FlexItem>
          </InnerTabLink>
        ))}
      </FlexItem>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
