import React from "react";

import "./CircleBadge.scss";

export type Props = {
  name: string;
  color?: string;
};

export function CircleBadge({ name, color }: Props) {
  return (
    <div className="circle-badge" style={{ backgroundColor: color }}>
      {name && name.slice(0, 1).toUpperCase()}
    </div>
  );
}
