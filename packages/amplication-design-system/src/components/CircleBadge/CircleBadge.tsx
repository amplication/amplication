import React from "react";

import "./CircleBadge.scss";

export type Props = {
  name?: string;
  color?: string;
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
  size = "medium",
  children = null,
}) => (
  <div
    className={`circle-badge${size ? ` ${size}` : ""}`}
    style={{ backgroundColor: color }}
  >
    {children ? children : name && name.slice(0, 1).toUpperCase()}
  </div>
);
