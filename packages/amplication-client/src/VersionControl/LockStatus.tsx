import { useContext } from "react";

import * as models from "../models";
import PendingChangesContext from "../VersionControl/PendingChangesContext";

export type LockData = {
  lockedByUser?: models.User | null;
  lockedAt: Date;
  resourceId?: string;
  resourceType: models.EnumPendingChangeResourceType;
};

type Props = {
  lockData: LockData;
};

/**A centralizes body-less component that updates the pendingChangesContext  */
function LockStatus({ lockData }: Props) {
  const pendingChangesContext = useContext(PendingChangesContext);

  //Add the current locked resource to the pending changes list if it is not there yet
  if (lockData.resourceId && lockData.lockedByUser) {
    pendingChangesContext.addChange(lockData.resourceId, lockData.resourceType);
  }

  return null;
}

export default LockStatus;
