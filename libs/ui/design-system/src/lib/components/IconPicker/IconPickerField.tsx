import { useField } from "formik";
import React, { useCallback } from "react";
import { IconPicker } from "./IconPicker";

type Props = {
  name: string;
  label?: string;
  iconOnlyMode?: boolean;
};

export const IconPickerField: React.FC<Props> = ({
  name,
  label,
  iconOnlyMode,
}) => {
  const [field, , { setValue }] = useField<string>(name);

  const handleChange = useCallback(
    (icon: string) => {
      setValue(icon);
    },
    [setValue]
  );

  return (
    <IconPicker
      onChange={handleChange}
      selectedIcon={field.value}
      label={label}
      iconOnlyMode={iconOnlyMode}
    />
  );
};
