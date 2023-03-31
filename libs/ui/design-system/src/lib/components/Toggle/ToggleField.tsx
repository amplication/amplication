import React from "react";
import { useField } from "formik";
import { Toggle, Props as ToggleProps } from "./Toggle";

export type Props = ToggleProps & {
  name: string;
  label: string;
  forwardRef?: React.MutableRefObject<HTMLButtonElement>;
};

export const ToggleField: React.FC<Props> = (props) => {
  const { name, forwardRef } = props;

  const [field] = useField({
    name,
    type: "checkbox",
  });
  return (
    <Toggle {...props} {...field} {...(forwardRef ? { forwardRef } : {})} />
  );
};
