import React from "react";
import { useField } from "formik";
import { Toggle, Props as ToggleProps } from "./Toggle";

export type Props = ToggleProps & {
  name: string;
  label: string;
};

export const ToggleField = (props: Props) => {
  const { name } = props;
  const [field] = useField({
    name,
    type: "checkbox",
  });
  return <Toggle {...props} {...field} />;
};
