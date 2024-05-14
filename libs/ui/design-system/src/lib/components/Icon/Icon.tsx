import React from "react";

import classNames from "classnames";

import "./Icon.scss";
import { EnumTextColor } from "../Text/Text";

export type IconSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

export type Props = {
  icon: string;
  size?: IconSize;
  className?: string;
  color?: EnumTextColor;
};

const CLASS_NAME = "amp-icon";

export function Icon({ icon, size, className, color }: Props) {
  const colorStyle = color && { color: `var(--${color})` };

  return (
    <i
      style={{
        ...colorStyle,
      }}
      className={classNames(CLASS_NAME, className, {
        [`${CLASS_NAME}--size-${size}`]: size,
      })}
    >
      {icon}
    </i>
  );
}
