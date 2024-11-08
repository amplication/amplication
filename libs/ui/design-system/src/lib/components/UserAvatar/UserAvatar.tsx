import React from "react";

import "./UserAvatar.scss";
import { useTagColorStyle } from "../ColorPicker/useTagColorStyle";

export type Props = {
  firstName?: string;
  lastName?: string;
  color?: string;
};

export function UserAvatar({ firstName, lastName, color }: Props) {
  const { themeVars } = useTagColorStyle(color);

  return (
    <span className="user-avatar" style={themeVars}>
      <span className="user-avatar__initials">
        {firstName && firstName.slice(0, 1).toUpperCase()}
        {lastName && lastName.slice(0, 1).toUpperCase()}
      </span>
    </span>
  );
}
