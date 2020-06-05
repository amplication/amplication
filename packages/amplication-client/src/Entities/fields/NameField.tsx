import React from "react";
import { TextField, Props } from "./TextField";

const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT = {
  persistent: false,
  validationMsg: true,
  children:
    "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number",
};

const NameField = (props: Props) => {
  return (
    <TextField
      label="Name"
      minLength={1}
      {...props}
      pattern={NAME_PATTERN}
      helpText={HELP_TEXT}
    />
  );
};

export default NameField;
