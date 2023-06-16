import React from "react";
import { TextField, TextFieldProps } from "@amplication/ui/design-system";

export const DisplayNameField = (props: TextFieldProps) => {
  return <TextField {...props} autoComplete="off" />;
};
