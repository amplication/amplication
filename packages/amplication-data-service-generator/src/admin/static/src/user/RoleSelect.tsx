import React from "react";
import { SelectField, SelectFieldProps } from "@amplication/design-system";
//@ts-ignore
import { EnumRoles } from "./EnumRoles";

const OPTIONS = Object.keys(EnumRoles).map((key) => ({
  value: key,
  label: key,
}));

type Props = Omit<SelectFieldProps, "options">;

export const RoleSelect = (props: Props) => {
  return <SelectField {...props} options={OPTIONS} />;
};
