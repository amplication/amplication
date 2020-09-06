import React, { useCallback, useState } from "react";
import { useField } from "formik";
import { pascalCase } from "pascal-case";

import { Button, EnumButtonStyle } from "../Components/Button";
import OptionSetItem from "./OptionSetItem";
import "./OptionSet.scss";

const CLASS_NAME = "option-set";

type OptionItem = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name: string;
  isDisabled?: boolean;
};

const OptionSet = ({ label, name, isDisabled }: Props) => {
  const [newLabel, setNewLabel] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [valueChanged, setValueChanged] = useState<boolean>(false);

  const [field, , { setValue }] = useField<OptionItem[]>(name);

  const handleLabelChange = useCallback(
    (event) => {
      setNewLabel(event.target.value);
      if (!valueChanged) {
        setNewValue(pascalCase(event.target.value));
      }
    },
    [setNewLabel, valueChanged]
  );
  const handleValueChange = useCallback(
    (event) => {
      setNewValue(event.target.value);
      setValueChanged(true);
    },
    [setNewValue, setValueChanged]
  );

  const handleAddOption = useCallback(
    (event) => {
      const options = field.value || [];
      setValue(
        options.concat([
          {
            label: newLabel,
            value: newValue,
          },
        ])
      );
      setNewLabel("");
      setNewValue("");
      setValueChanged(false);
    },
    [setValue, newLabel, newValue, field]
  );

  return (
    <div className={CLASS_NAME}>
      <h3>Options</h3>
      <div className={`${CLASS_NAME}__options`}>
        {field.value?.map((item) => (
          <OptionSetItem
            key={item.value}
            label={item.label}
            value={item.value}
            onRemove={() => {}}
          />
        ))}
      </div>
      {!isDisabled && (
        <>
          <h3>Add Option</h3>
          <label>
            <span>Option Label</span>
            <input
              type="text"
              value={newLabel}
              onChange={handleLabelChange}
              required
            />
          </label>
          <label>
            <span>Option Value</span>
            <input
              type="text"
              value={newValue}
              onChange={handleValueChange}
              required
            />
          </label>
          <Button
            type="button"
            buttonStyle={EnumButtonStyle.Secondary}
            onClick={handleAddOption}
          >
            Add Option
          </Button>
        </>
      )}
    </div>
  );
};

export default OptionSet;
