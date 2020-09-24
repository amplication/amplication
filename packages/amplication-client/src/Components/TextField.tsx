import React from "react";
import { useField } from "formik";
import { TextInput, Props as TextInputProps } from "./TextInput";

export type Props = Omit<TextInputProps, "hasError"> & {
  name: string;
};

export const TextField = (props: Props) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    <TextInput
      {...props}
      {...field}
      hasError={Boolean(meta.error) && meta.touched}
      helpText={props.helpText || meta.error}
    />
  );
};
