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
        {firstName && firstName.substr(0, 1).toUpperCase()}
        {lastName && lastName.substr(0, 1).toUpperCase()}
      </span>
    </span>
  );
}
