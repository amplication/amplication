import React, { useMemo } from "react";
import { Icon } from "../Icon/Icon";
import { Tooltip } from "../Tooltip/Tooltip";
import classNames from "classnames";
import { formatDistanceToNow } from "date-fns";
import "./TimeSince.scss";

const CLASS_NAME = "time-since";

export enum EnumTimeSinceSize {
  short = "short",
  Default = "default",
}

export type Props = {
  time: Date;
  size?: EnumTimeSinceSize;
};

export function TimeSince({ time, size = EnumTimeSinceSize.Default }: Props) {
  const formattedTime = useMemo(() => {
    return formatTimeToNow(time);
  }, [time]);

  return (
    <span className={classNames(CLASS_NAME, `${CLASS_NAME}--${size}`)}>
      <Tooltip
        className={`${CLASS_NAME}__tooltip`}
        aria-label={formattedTime || ""}
      >
        <span className={`${CLASS_NAME}__icon`}>
          <Icon icon="calendar" />
        </span>
        <span className={`${CLASS_NAME}__time`}>{formattedTime}</span>
      </Tooltip>
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
