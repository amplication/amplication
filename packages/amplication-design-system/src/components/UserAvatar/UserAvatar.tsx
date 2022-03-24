import React from "react";

import "./UserAvatar.scss";

export type Props = {
  firstName?: string;
  lastName?: string;
};

export function UserAvatar({ firstName, lastName }: Props) {
  return (
    <span className="user-avatar">
      <span className="user-avatar__initials">
        {firstName && firstName.slice(0, 1).toUpperCase()}
        {lastName && lastName.slice(0, 1).toUpperCase()}
      </span>
    </span>
  );
}
