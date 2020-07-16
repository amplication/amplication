import React, { useCallback } from "react";
import { useField } from "formik";
import { Checkbox } from "@rmwc/checkbox";

type optionItem = {
  value: string;
  label: string;
};

export type Props = {
  name: string;
  options: optionItem[];
};

export const CheckboxListField = ({ name, options }: Props) => {
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
    },
    [setValue, field.value]
  );

  return (
    <>
      {options.map((option) => (
        <p>
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
