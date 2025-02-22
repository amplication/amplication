import React from "react";

import classNames from "classnames";

import "./Icon.scss";
import { EnumTextColor } from "../Text/Text";

export type IconSize =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge";

export enum EnumIconFamily {
  System = "system",
  Custom = "custom",
}

export type Props = {
  icon: string;
  size?: IconSize;
  className?: string;
  color?: EnumTextColor;
  family?: EnumIconFamily;
  style?: React.CSSProperties;
};

const CLASS_NAME = "amp-icon";

export function Icon({
  icon,
  size,
  className,
  color,
  style,
  family = EnumIconFamily.System,
}: Props) {
  const colorStyle = color && { color: `var(--${color})` };

  return (
    <i
      style={{
        ...style,
        ...colorStyle,
      }}
      className={classNames(
        CLASS_NAME,
        className,
        `${CLASS_NAME}--family-${family}`,
        {
          [`${CLASS_NAME}--size-${size}`]: size,
        }
      )}
    >
      {icon}
    </i>
  );
}
