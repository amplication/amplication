import React from "react";
import { TextField, Props } from "./TextField";
import classNames from "classnames";
import "./EditableTitleField.scss";

type EditableTitleFieldProps = Props & {
  secondary?: boolean;
};

const EditableTitleField = (props: EditableTitleFieldProps) => {
  return (
    <TextField
      className={classNames("editable-title-field", {
        "editable-title-field--secondary": props.secondary,
      })}
      autoComplete="off"
      minLength={1}
      placeholder={props.label}
      {...props}
    />
  );
};

export default EditableTitleField;
