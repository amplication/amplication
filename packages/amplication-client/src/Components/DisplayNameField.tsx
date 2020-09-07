import React from "react";
import { TextField, Props } from "./TextField";

export const DisplayNameField = (props: Props) => {
  return <TextField autoComplete="off" {...props} />;
};
