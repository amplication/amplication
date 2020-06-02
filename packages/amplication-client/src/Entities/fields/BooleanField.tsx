import React from "react";
import { useField } from "formik";
import { Switch, SwitchProps, SwitchHTMLProps } from "@rmwc/switch";
import "@rmwc/switch/styles";

type Props = SwitchProps & SwitchHTMLProps & { name: string };

export const BooleanField = (props: Props) => {
  const [field] = useField({
    ...props,
    type: "checkbox",
  });
  return <Switch {...field} {...props} />;
};
