import React, { useCallback, useState, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useField } from "formik";

import { isEmpty } from "lodash";

import "./PermissionsField.scss";
import * as models from "../models";
import { MultiStateToggle } from "../Components/MultiStateToggle";
import {
  SelectMenu,
  SelectMenuModal,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuFilter,
} from "../Components/SelectMenu";
import * as permissionsTypes from "../Permissions/types";
import { EnumButtonStyle } from "../Components/Button";
import { Button } from "../Components/Button";
import {
  Panel,
  EnumPanelStyle,
  PanelExpandableBottom,
} from "../Components/Panel";

/**@todo: add system role for User */
const USER_SYSTEM_ROLE = "USER";

type TData = {
  appRoles: models.AppRole[];
};

enum EnumPermissionsType {
  AllRoles = "AllRoles",
  Granular = "Granular",
  Disabled = "Disabled",
}

const OPTIONS = [
  { value: EnumPermissionsType.AllRoles, label: "All Roles" },
  { value: EnumPermissionsType.Granular, label: "Granular" },
  { value: EnumPermissionsType.Disabled, label: "Disabled" },
];

type Props = {
  name: string;
  actionDisplayName: string;
  entityDisplayName: string;
  applicationId: string;
};

const getInitialType = (permissions: permissionsTypes.PermissionItem[]) => {
  if (isEmpty(permissions)) {
    return EnumPermissionsType.Disabled;
  } else {
    const userSystemRole =
      permissions &&
      permissions?.find((item) => item.roleName === USER_SYSTEM_ROLE);

    if (userSystemRole) {
      return EnumPermissionsType.AllRoles;
    } else {
      return EnumPermissionsType.Granular;
    }
  }
};

export const PermissionsField = ({
  name,
  actionDisplayName,
  entityDisplayName,
  applicationId,
}: Props) => {
  const [, meta, helpers] = useField<permissionsTypes.PermissionItem[]>(name);
  const { value } = meta;
  const { setValue } = helpers;

  const [selectedType, setSelectedType] = useState(getInitialType(value));
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [prevList, setPrevList] = useState<permissionsTypes.PermissionItem[]>(
    []
  );

  const selectedRoles = useMemo<Set<string>>(() => {
    if (value) {
      return new Set(value.map((item) => item.roleId));
    } else return new Set<string>();
  }, [value]);

  const handleRoleSelectionChange = useCallback(
    ({ roleId, roleName }: permissionsTypes.PermissionItem) => {
      let newValue = [...value];
      const otherSelections = newValue.filter((item) => item.roleId !== roleId);

      if (otherSelections.length === value?.length) {
        newValue.push({
          actionName: name,
          roleId: roleId,
          roleName: roleName,
        });
      } else {
        newValue = otherSelections;
      }
      setValue(newValue);
    },
    [setValue, value, name]
  );

  /**@todo: handle loading state and errors */
  const { data, loading } = useQuery<TData>(GET_ROLES, {
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
    (type) => {
      if (selectedType === EnumPermissionsType.Granular) {
        console.log("save list", value);
        setPrevList(value);
      } else if (type === EnumPermissionsType.Granular) {
        console.log("reload list", prevList);
        setValue(prevList);
      }

      if (type === EnumPermissionsType.Disabled) {
        setValue([]);
      }
      setSelectedType(type);
    },
    [setSelectedType, setValue, value, prevList, setPrevList, selectedType]
  );

  return (
    <Panel className="permissions-field" panelStyle={EnumPanelStyle.Bordered}>
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
          ? `${value.length} roles selected`
          : "This action is disabled"}
      </h4>
      <MultiStateToggle
        label=""
        name="action_"
        options={OPTIONS}
        onChange={handleOnChangeType}
        selectedValue={selectedType}
      />

      <PanelExpandableBottom
        isOpen={selectedType === EnumPermissionsType.Granular}
      >
        <SelectMenu
          icon="add"
          title="Add roles"
          buttonStyle={EnumButtonStyle.Clear}
        >
          <SelectMenuModal>
            {loading ? (
              "Loading.."
            ) : (
              <>
                <SelectMenuFilter
                  label="search roles"
                  onChange={handleSearchChange}
                  placeholder="search roles"
                />
                <SelectMenuList>
                  {data?.appRoles?.map((role) => (
                    <SelectMenuItem
                      selected={selectedRoles.has(role.id)}
                      onSelectionChange={handleRoleSelectionChange}
                      itemData={{
                        roleName: role.displayName,
                        roleId: role.id,
                      }}
                    >
                      {role.displayName}
                    </SelectMenuItem>
                  ))}
                </SelectMenuList>
              </>
            )}
          </SelectMenuModal>
        </SelectMenu>

        {value.map((item) => (
          <span className="permissions-field__role">
            {item.roleName}
            <Button icon="close" buttonStyle={EnumButtonStyle.Clear}></Button>
          </span>
        ))}
      </PanelExpandableBottom>
    </Panel>
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
