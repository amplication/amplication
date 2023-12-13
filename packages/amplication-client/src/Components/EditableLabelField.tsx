import React from "react";
import { TextField, TextFieldProps } from "@amplication/ui/design-system";
import classNames from "classnames";
import "./EditableLabelField.scss";

const EditableLabelField = (props: TextFieldProps) => {
  return (
    <TextField
      className={classNames("editable-label-field")}
      autoComplete="off"
      minLength={1}
      placeholder={props.label}
      {...props}
    />
  );
};

export default EditableLabelField;
