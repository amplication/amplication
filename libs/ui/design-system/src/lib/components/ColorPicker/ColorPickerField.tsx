import { useField } from "formik";
import React, { useCallback } from "react";
import { ColorPicker } from "./ColorPicker";

type Props = {
  name: string;
  label?: string;
  iconOnlyMode?: boolean;
  disabled?: boolean;
};

export const ColorPickerField: React.FC<Props> = ({
  name,
  label,
  iconOnlyMode,
  disabled,
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
      disabled={disabled}
      onChange={handleChange}
      selectedColor={field.value || "#ffffff"}
      label={label}
      iconOnlyMode={iconOnlyMode}
    />
  );
};
