import React from "react";
import { useField } from "formik";
import {
  TextField as RMWCTextField,
  TextFieldProps,
  TextFieldHTMLProps,
} from "@rmwc/textfield";
import "@rmwc/textfield/styles";

type Props = TextFieldProps & TextFieldHTMLProps & { name: string };

export const TextField = (props: Props) => {
  const [field] = useField(props);
  return <RMWCTextField {...field} {...props} />;
};
