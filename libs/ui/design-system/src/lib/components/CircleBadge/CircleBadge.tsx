import React from "react";

import "./CircleBadge.scss";
import { EnumTextColor } from "../Text/Text";

export type Props = {
  name?: string;
  color?: string;
  themeColor?: EnumTextColor;
  border?: string;
  size?:
    | "xxsmall"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "xxlarge";
  children?: React.ReactNode;
};

export const CircleBadge: React.FC<Props> = ({
  name,
  color,
  border,
  themeColor,
  size = "medium",
  children = null,
}) => (
  <div
    className={`circle-badge${size ? ` ${size}` : ""}`}
    style={{
      backgroundColor: themeColor ? `var(--${themeColor})` : color,
      border: border,
    }}
  >
    {children ? children : name && name.slice(0, 1).toUpperCase()}
  </div>
);
