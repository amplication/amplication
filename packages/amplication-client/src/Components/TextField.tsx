import React from "react";
import { useField } from "formik";
import { TextInput, Props as TextInputProps } from "./TextInput";

export type Props = Omit<TextInputProps, "hasError">;

export const TextField = (props: Props) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return <TextInput {...field} hasError={Boolean(meta.error)} />;
};
