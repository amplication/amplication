import React from "react";
import { Tooltip } from "@primer/components";
import { format } from "date-fns";

import UserAvatar from "../Components/UserAvatar";
import * as models from "../models";

import "./LockStatus.scss";

const CLASS_NAME = "lock-status";

export type LockData = {
  lockedByUser?: models.User | null;
  lockedAt: Date;
};

type Props = {
  lockData: LockData;
};

function LockStatus({ lockData }: Props) {
  const lockedAt = new Date(lockData.lockedAt);
  return (
    <div className={CLASS_NAME}>
      {lockData && lockData.lockedByUser && (
        <Tooltip
          direction="s"
          noDelay
          wrap
          aria-label={`Locked by ${lockData.lockedByUser.account?.firstName} ${
            lockData.lockedByUser.account?.lastName
          } since ${format(lockedAt, "P p")}`}
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
