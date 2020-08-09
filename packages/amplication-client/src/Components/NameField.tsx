import React from "react";
import { TextField, Props } from "./TextField";

/** @todo share code with server */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";

const NameField = (props: Props) => {
  return (
    <TextField
      label="Name"
      autoComplete="off"
      minLength={1}
      {...props}
      pattern={NAME_PATTERN}
      helpText={HELP_TEXT}
    />
  );
};

export default NameField;
