import React, { useMemo, useContext } from "react";
import { Tooltip } from "@primer/components";
import { format } from "date-fns";

import * as models from "../models";
import LockStatusIcon from "./LockStatusIcon";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

const CLASS_NAME = "lock-status";
const TOOLTIP_DIRECTION = "s";

export type LockData = {
  lockedByUser?: models.User | null;
  lockedAt: Date;
  resourceId?: string;
  resourceType: models.EnumPendingChangeResourceType;
};

type Props = {
  lockData: LockData;
  applicationId: string;
};

function LockStatus({ applicationId, lockData }: Props) {
  const pendingChangesContext = useContext(PendingChangesContext);

  //Add the current locked resource to the pending changes list if it is not there yet
  if (lockData.resourceId && lockData.lockedByUser) {
    pendingChangesContext.addChange(lockData.resourceId, lockData.resourceType);
  }

  const formattedDate = useMemo(() => {
    if (!lockData.lockedByUser) return null;
    const lockedAt = new Date(lockData.lockedAt);
    return format(lockedAt, "P p");
  }, [lockData.lockedAt, lockData.lockedByUser]);

  if (!lockData) return null;

  const enabled = Boolean(lockData.lockedByUser);
  const message = enabled
    ? `Pending changes since ${formattedDate}`
    : "No pending changes";

  return (
    <div className={CLASS_NAME}>
      <Tooltip direction={TOOLTIP_DIRECTION} noDelay wrap aria-label={message}>
        <LockStatusIcon enabled={enabled} />
      </Tooltip>
    </div>
  );
}

export default LockStatus;
