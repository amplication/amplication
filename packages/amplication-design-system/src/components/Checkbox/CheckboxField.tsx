import React from "react";
import { useField } from "formik";
import { Checkbox, CheckboxProps, CheckboxHTMLProps } from "@rmwc/checkbox";
import "@rmwc/checkbox/styles";
import "./CheckboxField.scss";

export type Props = CheckboxProps &
  CheckboxHTMLProps & { name: string; label: string };

export const CheckboxField = (props: Props) => {
  const [field] = useField({
    ...props,
    type: "checkbox",
  });
  return <Checkbox className="checkbox-field" {...field} {...props} />;
};
