import React, { useCallback } from "react";
import { FieldArray, FieldArrayRenderProps } from "formik";
import { pascalCase } from "pascal-case";
import { get } from "lodash";

import { Icon } from "@rmwc/icon";
import { Button, EnumButtonStyle } from "../Components/Button";
import { TextField } from "../Components/TextField";
import "./OptionSet.scss";

type OptionItem = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name: string;
  isDisabled?: boolean;
};

const CLASS_NAME = "option-set";
const NEW_OPTION: OptionItem = { value: "", label: "" };

const OptionSet = ({ label, name, isDisabled }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <FieldArray name={name} component={OptionSetOptions} />
    </div>
  );
};

export default OptionSet;

export const OptionSetOptions = ({
  form,
  name,
  push,
  remove,
  replace,
}: FieldArrayRenderProps) => {
  const value = get(form.values, name);

  const handleAddOption = useCallback(() => {
    push(NEW_OPTION);
  }, [push]);

  return (
    <div>
      {value?.map((option: OptionItem, index: number) => (
        <OptionSetOption
          key={index}
          index={index}
          onChange={replace}
          onRemove={remove}
          name={name}
        />
      ))}
      <Button onClick={handleAddOption} buttonStyle={EnumButtonStyle.Clear}>
        <Icon icon="plus" />
        Add option
      </Button>
    </div>
  );
};

type OptionSetOption = {
  name: string;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, option: OptionItem) => void;
};

export const OptionSetOption = ({
  name,
  index,
  onRemove,
  onChange,
}: OptionSetOption) => {
  const handleRemoveOption = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  const handleLabelChange = useCallback(
    (event) => {
      const label = event.target.value;
      const newValue = pascalCase(event.target.value);
      const option = { label: label, value: newValue };
      onChange(index, option);
    },
    [index, onChange]
  );

  return (
    <div className="option-set_option">
      <TextField
        name={`${name}.${index}.label`}
        label="Label"
        onChange={handleLabelChange}
      />
      <TextField name={`${name}.${index}.value`} label="Value" />
      <div className="option-set_option_action">
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="trash_2"
          onClick={handleRemoveOption}
        />
      </div>
    </div>
  );
};
