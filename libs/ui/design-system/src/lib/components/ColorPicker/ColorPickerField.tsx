import { useField } from "formik";
import React, { useCallback } from "react";
import { ColorPicker } from "./ColorPicker";

type Props = {
  name: string;
  label?: string;
  iconOnlyMode?: boolean;
};

export const ColorPickerField: React.FC<Props> = ({
  name,
  label,
  iconOnlyMode,
}) => {
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
      iconOnlyMode={iconOnlyMode}
    />
  );
};
