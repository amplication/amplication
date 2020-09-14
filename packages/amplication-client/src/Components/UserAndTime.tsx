import React, { useMemo } from "react";
import * as models from "../models";
import { formatDistanceToNow } from "date-fns";
import "./UserAndTime.scss";

type Props = Pick<models.Account, "firstName" | "lastName"> & {
  time: Date;
};

function UserAndTime({ firstName, lastName, time }: Props) {
  const formattedTime = useMemo(() => {
    return formatTimeToNow(time);
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

function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}
