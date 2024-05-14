import React, { useState, useCallback } from "react";
import { useField } from "formik";
import { isEmpty } from "lodash";
import {
  TextField,
  Icon,
  FlexItem,
  EnumGapSize,
  Text,
  EnumTextStyle,
  EnumItemsAlign,
  EnumFlexDirection,
} from "@amplication/ui/design-system";
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

  const disabled = props.disabled || false;

  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return isOpen ? (
    <TextField
      name={props.name}
      label={props.label}
      disabled={props.disabled}
      autoComplete="off"
      textarea
      textareaSize="small"
      rows={3}
    />
  ) : !isEmpty(value) ? (
    <div>
      <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.None}>
        <Text textStyle={EnumTextStyle.Label}>Description</Text>
        <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.End}>
          <Text textStyle={EnumTextStyle.Description}>{value}</Text>

          <Button
            onClick={handleClick}
            buttonStyle={EnumButtonStyle.Text}
            disabled={disabled}
            title="Edit description"
          >
            <Icon icon="edit" />
          </Button>
        </FlexItem>
      </FlexItem>
    </div>
  ) : (
    <Button onClick={handleClick} buttonStyle={EnumButtonStyle.Text}>
      <Icon icon="plus" />
      Add description
    </Button>
  );
};

export default OptionalDescriptionField;
