import React from "react";
import { useField } from "formik";
import classNames from "classnames";
import { FormControlLabel, Radio, FormControlLabelProps } from "@mui/material";
import "./RadioButtonField.scss";

export interface Props extends Omit<FormControlLabelProps, "control"> {
  name: string;
  label: string;
}

export const RadioButtonField = ({ className, ...props }: Props) => {
  const { name } = props;
  const [field] = useField({
    name,
    type: "radio",
  });

  return (
    <FormControlLabel
      className={classNames("amp-radio-field", className)}
      {...field}
      {...props}
      control={<Radio classes={{ checked: "amp-radio-field--checked" }} />}
    />
  );
};
