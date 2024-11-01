import { useField } from "formik";
import React, { useCallback } from "react";
import { ColorPicker } from "./ColorPicker";

type Props = {
  name: string;
  label: string;
};

export const ColorPickerField: React.FC<Props> = ({ name, label }) => {
  const [field, , { setValue }] = useField<string>(name);

  const handleChange = useCallback(
    (color: string) => {
      setValue(color);
    },
    [setValue]
  );

  return (
    <ColorPicker
      onChange={handleChange}
      selectedColor={field.value}
      label={label}
    />
  );
};
