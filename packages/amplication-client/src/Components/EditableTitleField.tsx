import React from "react";
import { TextField, TextFieldProps } from "@amplication/ui/design-system";
import classNames from "classnames";
import "./EditableTitleField.scss";

type EditableTitleFieldProps = TextFieldProps & {
  secondary?: boolean;
};

const EditableTitleField = (props: EditableTitleFieldProps) => {
  const { secondary, ...rest } = props;
  return (
    <TextField
      className={classNames("editable-title-field", {
        "editable-title-field--secondary": secondary,
      })}
      autoComplete="off"
      minLength={1}
      placeholder={props.label}
      {...rest}
    />
  );
};

export default EditableTitleField;
