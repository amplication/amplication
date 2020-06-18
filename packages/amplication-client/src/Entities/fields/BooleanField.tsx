import React from "react";
import { useField } from "formik";
import { Switch, SwitchProps, SwitchHTMLProps } from "@rmwc/switch";
import "@rmwc/switch/styles";
import "./BooleanField.scss";

type Props = SwitchProps & SwitchHTMLProps & { name: string; label: string };

export const BooleanField = (props: Props) => {
  const { label, ...rest } = props;
  const [field] = useField({
    ...props,
    type: "checkbox",
  });
  return (
    <div className="boolean-field">
      {label} <Switch {...field} {...rest} />
    </div>
  );
};
