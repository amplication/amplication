import React, { useMemo, useEffect } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Tooltip } from "@primer/components";
import { format } from "date-fns";

import * as models from "../models";
import "./LockStatus.scss";
import CircleIcon, { EnumCircleIconStyle } from "../Components/CircleIcon";
import {
  PendingChangeStatusData,
  GET_PENDING_CHANGES_STATUS,
} from "./PendingChangesStatus";

const CLASS_NAME = "lock-status";
const TOOLTIP_DIRECTION = "s";

export type LockData = {
  lockedByUser?: models.User | null;
  lockedAt: Date;
  resourceId: string;
  resourceType: models.EnumPendingChangeResourceType;
};

type Props = {
  lockData: LockData;
  applicationId: string;
};

function LockStatus({ applicationId, lockData }: Props) {
  //Add the current locked resource to the pending changes list if it is not there yet
  const apolloClient = useApolloClient();
  useEffect(() => {
    if (!lockData.resourceId) {
      return;
    }

    const queryData = apolloClient.readQuery<PendingChangeStatusData>({
      query: GET_PENDING_CHANGES_STATUS,
      variables: { applicationId: applicationId },
    });

    if (queryData === null) {
      return;
    }

    const existingChange = queryData.pendingChanges.find(
      (change) =>
        change.resourceId === lockData.resourceId &&
        change.resourceType === lockData.resourceType
    );

    if (existingChange) {
      return;
    }

    apolloClient.writeQuery({
      query: GET_PENDING_CHANGES_STATUS,
      variables: { applicationId: applicationId },
      data: {
        pendingChanges: queryData.pendingChanges.concat([
          {
            __typename: "PendingChange",
            resourceId: lockData.resourceId,
            resourceType: lockData.resourceType,
          },
        ]),
      },
    });
  }, [lockData.resourceId, lockData.resourceType, apolloClient, applicationId]);

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
