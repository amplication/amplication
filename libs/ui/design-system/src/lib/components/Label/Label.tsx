import React from "react";
import {
  Props as InputToolTipProps,
  InputTooltip,
} from "../InputTooltip/InputTooltip";

import "./Label.scss";
export type LabelTypes = "normal" | "error";

export type Props = React.HTMLProps<HTMLSpanElement> & {
  text: string;
  type?: LabelTypes;
  inputToolTip?: InputToolTipProps | undefined;
};

const CLASS_NAME = "amplication-label";

export function Label({ text, inputToolTip, ...props }: Props) {
  return (
    <span
      {...props}
      className={`${CLASS_NAME}__${props.type || ""} ${props.className || ""}`}
    >
      <span className={`${CLASS_NAME}__inner`}>
        {text}
        {inputToolTip && <InputTooltip {...inputToolTip} />}
      </span>
    </span>
  );
}
