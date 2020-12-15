import React from "react";
import { SelectField, SelectFieldProps } from "@amplication/design-system";
//@ts-ignore
import { ROLES } from "./roles";

declare interface Role {
  name: string;
  displayName: string;
}

const OPTIONS = ROLES.map((role: Role) => ({
  value: role.name,
  label: role.displayName,
}));

type Props = Omit<SelectFieldProps, "options">;

export const RoleSelect = (props: Props) => {
  return <SelectField {...props} options={OPTIONS} />;
};
