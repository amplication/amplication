import React, { useState, useCallback } from "react";
import { useField } from "formik";
import { isEmpty } from "lodash";
import { TextField, Icon } from "@amplication/ui/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";

type Props = {
  name: string;
  label: string;
  disabled?: boolean;
};

const OptionalDescriptionField = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, meta] = useField(props.name);

  const { value } = meta;

  const showField = !isEmpty(value) || isOpen;

  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return showField ? (
    <TextField
      name={props.name}
      label={props.label}
      disabled={props.disabled}
      autoComplete="off"
      textarea
      rows={3}
    />
  ) : (
    <Button onClick={handleClick} buttonStyle={EnumButtonStyle.Text}>
      <Icon icon="plus" />
      Add description
    </Button>
  );
};

export default OptionalDescriptionField;
