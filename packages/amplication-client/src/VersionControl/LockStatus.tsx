import React, { useMemo } from "react";
import { Tooltip } from "@primer/components";
import { format } from "date-fns";

import UserAvatar from "../Components/UserAvatar";
import * as models from "../models";

import "./LockStatus.scss";

const CLASS_NAME = "lock-status";
const TOOLTIP_DIRECTION = "s";

export type LockData = {
  lockedByUser?: models.User | null;
  lockedAt: Date;
};

type Props = {
  lockData: LockData;
};

function LockStatus({ lockData }: Props) {
  const formattedDate = useMemo(() => {
    const lockedAt = new Date(lockData.lockedAt);
    return format(lockedAt, "P p");
  }, [lockData.lockedAt]);

  return (
    <div className={CLASS_NAME}>
      {lockData && lockData.lockedByUser && (
        <Tooltip
          direction={TOOLTIP_DIRECTION}
          noDelay
          wrap
          aria-label={`Locked by ${lockData.lockedByUser.account?.firstName} ${lockData.lockedByUser.account?.lastName} since ${formattedDate}`}
        >
          <UserAvatar
            firstName={lockData.lockedByUser.account?.firstName}
            lastName={lockData.lockedByUser.account?.lastName}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default LockStatus;
