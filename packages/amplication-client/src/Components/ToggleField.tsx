import React from "react";
import { useField } from "formik";
import { Switch, SwitchProps, SwitchHTMLProps } from "@rmwc/switch";
import "@rmwc/switch/styles";
import "./ToggleField.scss";

type Props = SwitchProps & SwitchHTMLProps & { name: string; label: string };

export const ToggleField = (props: Props) => {
  const { label, ...rest } = props;
  const [field] = useField({
    ...props,
    type: "checkbox",
  });
  return (
    <div className="toggle-field">
      <label>
        {label} <Switch {...field} {...rest} />
      </label>
    </div>
  );
};
