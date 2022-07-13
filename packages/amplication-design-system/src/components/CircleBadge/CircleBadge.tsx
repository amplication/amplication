import React from "react";

import "./CircleBadge.scss";

export type Props = {
  name: string;
  color?: string;
  size?: "size24" | "size32" | "size40" | "size54" | "size64" | "size80";
};

export const CircleBadge: React.FC<Props> = ({
  name,
  color,
  children,
  size,
}) => {
  return (
    <div
      className={`circle-badge${size ? ` ${size}` : ""}`}
      style={{ backgroundColor: color }}
    >
      {name && name.slice(0, 1).toUpperCase()}
      {children}
    </div>
  );
};
