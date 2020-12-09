import React, { useCallback } from "react";
import { useField } from "formik";
import { Checkbox } from "@rmwc/checkbox";
import { OptionItem } from "../types";

export type Props = {
  name: string;
  options: OptionItem[];
  onChange: (value: string[]) => void;
};

export const CheckboxListField = ({ name, options, onChange }: Props) => {
  const [field, , { setValue }] = useField<string[]>(name);

  const handleClick = useCallback(
    (event) => {
      const currentValue: string = event.target.value;
      let fieldValue = field.value;
      if (fieldValue.includes(currentValue)) {
        fieldValue = fieldValue.filter((item) => item !== currentValue);
      } else {
        fieldValue = [...fieldValue, currentValue];
      }
      setValue(fieldValue);
      onChange(fieldValue);
    },
    [setValue, field.value, onChange]
  );

  return (
    <>
      {options.map((option) => (
        <p key={option.value}>
          <Checkbox
            checked={field.value.includes(option.value)}
            className="checkbox-field"
            onClick={handleClick}
            value={option.value}
            label={option.label}
          />
        </p>
      ))}
    </>
  );
};
