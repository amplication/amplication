import React from "react";

import "./UserAvatar.scss";

type Props = {
  firstName?: string;
  lastName?: string;
};

function UserAvatar({ firstName, lastName }: Props) {
  return (
    <span className="user-avatar">
      <span className="user-avatar__initials">
        {firstName && firstName.substr(0, 1).toUpperCase()}
        {lastName && lastName.substr(0, 1).toUpperCase()}
      </span>
    </span>
  );
}

export default UserAvatar;
