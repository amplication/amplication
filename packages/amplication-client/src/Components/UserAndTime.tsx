import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

import "./UserAndTime.scss";

type Props = {
  firstName?: string;
  lastName?: string;
  time: Date;
};

function UserAndTime({ firstName, lastName, time }: Props) {
  const formattedTime = useMemo(() => {
    return (
      time &&
      formatDistanceToNow(new Date(time), {
        addSuffix: true,
      })
    );
  }, [time]);

  return (
    <span className="user-and-time">
      <span className="user-and-time__initials">
        {firstName && firstName.substr(0, 1).toUpperCase()}
        {lastName && lastName.substr(0, 1).toUpperCase()}
      </span>
      {formattedTime}
    </span>
  );
}

export default UserAndTime;
