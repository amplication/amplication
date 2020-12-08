import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import "./UserAndTime.scss";

export type Props = {
  account?: { firstName?: string; lastName?: string };
  time: Date;
};

export function UserAndTime({ account, time }: Props) {
  const { firstName, lastName } = account || {};
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

function formatTimeToNow(time: Date | null): string | null {
  return (
    time &&
    formatDistanceToNow(new Date(time), {
      addSuffix: true,
    })
  );
}
