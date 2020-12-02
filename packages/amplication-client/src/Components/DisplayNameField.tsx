import React from "react";
import { TextField, Props } from "amplication-design-system";

export const DisplayNameField = (props: Props) => {
  return <TextField autoComplete="off" {...props} />;
};
