import React, { useCallback } from "react";
import { useField } from "formik";
import "@rmwc/chip/styles";
import "./PermissionsField.scss";
import * as models from "../models";
import { MultiStateToggle } from "./MultiStateToggle";

/** this component should also be used to manage EntityFieldPermission (and BlockPermission?) */
type PermissionsInput = models.EntityPermission[]; //| models.EntityFieldPermission[];

const OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "granular", label: "Granular" },
  { value: "disabled", label: "Disabled" },
];

type Props = {
  permissions?: PermissionsInput | null;
  action: models.EnumEntityAction;
  actionDisplayName: string;
  entityDisplayName: string;
};

export const PermissionsField = ({
  permissions,
  action,
  actionDisplayName,
  entityDisplayName,
}: Props) => {
  const [, meta, helpers] = useField<PermissionsInput>(action);

  const { value } = meta;
  const { setValue } = helpers;

  const handleClick = useCallback(
    (option) => {
      setValue(option);
    },
    [setValue]
  );

  const handleOnChange = useCallback(
    (option) => {
      setValue(option);
    },
    [setValue]
  );

  return (
    <div className="permissions-field">
      <h3>
        {actionDisplayName} {entityDisplayName}
      </h3>
      <h4 className="text-muted">3 roles selected</h4>
      <MultiStateToggle
        label=""
        name="action_"
        options={OPTIONS}
        onChange={handleOnChange}
        selectedValue="granular"
      />
      {permissions?.map((item) => (
        <span>{item.appRole?.name}</span>
      ))}
      {}
      <hr className="panel-divider" />
    </div>
  );
};
