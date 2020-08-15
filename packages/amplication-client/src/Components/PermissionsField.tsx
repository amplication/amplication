import React, { useCallback, useState } from "react";
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
}: Props) => {
  const [selectedType, setSelectedType] = useState(getInitialType(permissions));

  // const [, meta, helpers] = useField<PermissionsInput>(action);
  // const { value } = meta;
  // const { setValue } = helpers;

  // const handleClick = useCallback(
  //   (option) => {
  //     setValue(option);
  //   },
  //   [setValue]
  // );

  const handleOnChangeType = useCallback(
    (option) => {
      console.log("on change option", option);
      setSelectedType(option);
      // console.log("on change", selectedType);
      // setValue(option);
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
        <SelectMenu title="Add role" buttonStyle={EnumButtonStyle.Clear}>
          <SelectMenuModal>
            <SelectMenuFilter
              label="search roles"
              onChange={() => {}}
              placeholder="search roles"
            />
            <SelectMenuList>
              <SelectMenuItem
                selected={false}
                onSelectionChange={() => {}}
                itemData={{
                  filterName: "role name",
                  value: "roleid",
                }}
              >
                role name
              </SelectMenuItem>
              <SelectMenuItem
                selected={false}
                onSelectionChange={() => {}}
                itemData={{
                  filterName: "role name",
                  value: "roleid",
                }}
              >
                role name
              </SelectMenuItem>
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
