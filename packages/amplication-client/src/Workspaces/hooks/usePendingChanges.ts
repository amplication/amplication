import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import * as models from "../../models";
import { GET_PENDING_CHANGES_STATUS } from "../queries/projectQueries";

export type PendingChangeItem = Pick<
  models.PendingChange,
  "resourceId" | "resourceType"
>;

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

const usePendingChanges = (currentResource: models.Resource | undefined) => {
  // TODO: replace currenResource with currentProject
  const [pendingChanges, setPendingChanges] = useState<PendingChangeItem[]>([]);
  const [commitRunning, setCommitRunning] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { data: pendingChangesData, refetch } = useQuery<
    PendingChangeStatusData
  >(GET_PENDING_CHANGES_STATUS, {
    skip: !currentResource,
    variables: {
      resourceId: currentResource?.id,
    },
  });

  useEffect(() => {
    if (!pendingChangesData || !pendingChangesData.pendingChanges.length)
      return;

    setPendingChanges(pendingChangesData.pendingChanges);
  }, [pendingChangesData, setPendingChanges]);

  const addChange = useCallback(
    (
      resourceId: string,
      resourceType: models.EnumPendingChangeResourceType
    ) => {
      const existingChange = pendingChanges.find(
        (changeItem) =>
          changeItem.resourceId === resourceId &&
          changeItem.resourceType === resourceType
      );
      if (existingChange) {
        //reassign pending changes to trigger refresh
        setPendingChanges([...pendingChanges]);
      } else {
        setPendingChanges(
          pendingChanges.concat([
            {
              resourceId,
              resourceType,
            },
          ])
        );
      }
    },
    [pendingChanges, setPendingChanges]
  );

  const addEntity = useCallback(
    (entityId: string) => {
      addChange(entityId, models.EnumPendingChangeResourceType.Entity);
    },
    [addChange]
  );

  const addBlock = useCallback(
    (blockId: string) => {
      addChange(blockId, models.EnumPendingChangeResourceType.Block);
    },
    [addChange]
  );

  const resetPendingChanges = useCallback(() => {
    setPendingChanges([]);
    refetch();
  }, [refetch]);

  const setCommitRunningCallback = useCallback(
    (isRunning: boolean) => {
      setCommitRunning(isRunning);
    },
    [setCommitRunning]
  );
  const setPendingChangesError = useCallback(
    (onError: boolean) => {
      setIsError(onError);
    },
    [setIsError]
  );

  return {
    pendingChanges,
    commitRunning,
    pendingChangesIsError: isError,
    addEntity,
    addBlock,
    addChange,
    resetPendingChanges,
    setCommitRunning: setCommitRunningCallback,
    setPendingChangesError,
  };
};

export default usePendingChanges;
