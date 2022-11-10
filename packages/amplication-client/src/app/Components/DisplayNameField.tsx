import React from "react";
import { TextField, TextFieldProps } from "@amplication/design-system";

export const DisplayNameField = (props: TextFieldProps) => {
  // @ts-ignore
  return <TextField {...props} autoComplete="off" />;
};
