import React, { useCallback, useState, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Icon } from "@rmwc/icon";
import { isEmpty } from "lodash";
import classNames from "classnames";

import "./PermissionsField.scss";
import * as models from "../models";
import { MultiStateToggle } from "./MultiStateToggle";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuFilter,
} from "../Components/SelectMenu";
import { EnumButtonStyle } from "../Components/Button";

/** this component should also be used to manage EntityFieldPermission (and BlockPermission?) */
type PermissionsInput = models.EntityPermission[] | null; //| models.EntityFieldPermission[];

const USER_SYSTEM_ROLE = "USER";

type TData = {
  appRoles: models.AppRole[];
};

enum EnumPermissionsType {
  AllRoles = "All",
  Granular = "Granular",
  Disabled = "Disabled",
}

const OPTIONS = [
  { value: EnumPermissionsType.AllRoles, label: "All Roles" },
  { value: EnumPermissionsType.Granular, label: "Granular" },
  { value: EnumPermissionsType.Disabled, label: "Disabled" },
];

type Props = {
  permissions?: PermissionsInput;
  action: models.EnumEntityAction;
  actionDisplayName: string;
  entityDisplayName: string;
  applicationId: string;
};

const getInitialType = (permissions?: PermissionsInput) => {
  if (isEmpty(permissions)) {
    return EnumPermissionsType.Disabled;
  } else {
    const userSystemRole =
      permissions &&
      permissions?.find((item) => item.appRole?.name === USER_SYSTEM_ROLE);

    if (userSystemRole) {
      return EnumPermissionsType.AllRoles;
    } else {
      return EnumPermissionsType.Granular;
    }
  }
};

export const PermissionsField = ({
  permissions,
  action,
  actionDisplayName,
  entityDisplayName,
  applicationId,
}: Props) => {
  const [selectedType, setSelectedType] = useState(getInitialType(permissions));
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const selectedRoles = useMemo<Set<string>>(
    () => new Set(permissions?.map((item) => item.appRoleId)),
    [permissions]
  );
  // const [, meta, helpers] = useField<PermissionsInput>(action);
  // const { value } = meta;
  // const { setValue } = helpers;

  // const handleClick = useCallback(
  //   (option) => {
  //     setValue(option);
  //   },
  //   [setValue]
  // );

  const { data, loading, error } = useQuery<TData>(GET_ROLES, {
    variables: {
      id: applicationId,
      whereName: searchPhrase !== "" ? { contains: searchPhrase } : undefined,
    },
    /**@todo: add skip options to run the query only when select menu is open */
  });

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const handleOnChangeType = useCallback(
    (option) => {
      setSelectedType(option);
    },
    [setSelectedType]
  );

  return (
    <div className="permissions-field">
      <h3>
        <span className="permissions-field__action-name">
          {actionDisplayName}
        </span>{" "}
        {entityDisplayName}
      </h3>
      <h4 className="text-muted">
        {selectedType === EnumPermissionsType.AllRoles
          ? "All roles selected"
          : selectedType === EnumPermissionsType.Granular
          ? `${permissions?.length} roles selected`
          : "This action is disabled"}
      </h4>
      <MultiStateToggle
        label=""
        name="action_"
        options={OPTIONS}
        onChange={handleOnChangeType}
        selectedValue={selectedType}
      />

      <div
        className={classNames("expandable-bottom", {
          "expandable-bottom--open":
            selectedType === EnumPermissionsType.Granular,
        })}
      >
        <SelectMenu
          icon="add"
          title="Add roles"
          buttonStyle={EnumButtonStyle.Clear}
        >
          <SelectMenuModal>
            <SelectMenuFilter
              label="search roles"
              onChange={handleSearchChange}
              placeholder="search roles"
            />
            <SelectMenuList>
              {data?.appRoles.map((role) => (
                <SelectMenuItem
                  selected={selectedRoles.has(role.id)}
                  onSelectionChange={() => {}}
                  itemData={{
                    filterName: role.displayName,
                    value: role.id,
                  }}
                >
                  {role.displayName}
                </SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>

        {permissions?.map((item) => (
          <span className="permissions-field__role">
            {item.appRole?.displayName}
            <Icon icon="close" />
          </span>
        ))}
      </div>
    </div>
  );
};

export const GET_ROLES = gql`
  query getRoles($id: String!, $whereName: StringFilter) {
    appRoles(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: { displayName: asc }
    ) {
      id
      displayName
    }
  }
`;
