import React from "react";
import { useField } from "formik";
import { Radio, RadioProps, RadioHTMLProps } from "@rmwc/radio";
import "@rmwc/radio/styles";
import "./RadioButtonField.scss";

export type Props = RadioProps &
  RadioHTMLProps & { name: string; label: string };

export const RadioButtonField = (props: Props) => {
  const [field] = useField({
    ...props,
    type: "radio",
  });
  return <Radio className="amp-radio-field" {...field} {...props} />;
};
