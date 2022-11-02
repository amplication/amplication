import React, { useCallback } from "react";
import { useField } from "formik";
import { TextInput, Props as TextInputProps } from "../TextInput/TextInput";

export type Props = Omit<TextInputProps, "hasError"> & {
  name: string;
  showError?: boolean;
};

export const TextField: React.FC<Props> = ({ ref, ...props }) => {
  const [field, meta] = useField(props);
  const { onChange, ...rest } = props;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event);
      }
      field.onChange(event);
    },
    [onChange, field]
  );
  return (
    <TextInput
      {...rest}
      {...field}
      onChange={handleChange}
      hasError={
        props.showError !== false && Boolean(meta.error) && meta.touched
      }
      helpText={
        props.showError !== false ? props.helpText || meta.error : undefined
      }
    />
  );
};
