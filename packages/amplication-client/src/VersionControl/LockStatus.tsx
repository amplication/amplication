import React, { useMemo, useContext } from "react";
import { Tooltip } from "@primer/components";
import { format } from "date-fns";

import * as models from "../models";
import "./LockStatus.scss";
import CircleIcon, { EnumCircleIconStyle } from "../Components/CircleIcon";
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
  if (lockData.resourceId) {
    pendingChangesContext.addChange(lockData.resourceId, lockData.resourceType);
  }

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
          <CircleIcon large icon="lock" style={EnumCircleIconStyle.Warning} />
        </Tooltip>
      )}
    </div>
  );
}

export default LockStatus;
