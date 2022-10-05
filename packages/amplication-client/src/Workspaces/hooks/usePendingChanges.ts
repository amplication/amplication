import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy, isEqual } from "lodash";
import * as models from "../../models";
import { GET_PENDING_CHANGES_STATUS } from "../queries/projectQueries";

export type PendingChangeItem = models.PendingChange;

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

const usePendingChanges = (currentProject: models.Project | undefined) => {
  const [pendingChangesMap, setPendingChangesMap] = useState<string[]>([]);
  const [pendingChanges, setPendingChanges] = useState<PendingChangeItem[]>([]);
  const [commitRunning, setCommitRunning] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const {
    data: pendingChangesData,
    refetch,
    error: pendingChangesDataError,
    loading: pendingChangesDataLoading,
  } = useQuery<PendingChangeStatusData>(GET_PENDING_CHANGES_STATUS, {
    skip: !currentProject,
    variables: {
      projectId: currentProject?.id,
    },
  });

  useEffect(() => {
    if (!pendingChangesData || !pendingChangesData.pendingChanges.length)
      return;

    setPendingChanges(pendingChangesData.pendingChanges);
    setPendingChangesMap(
      pendingChangesData.pendingChanges.map((change) => change.originId)
    );
  }, [pendingChangesData, setPendingChanges]);

  useEffect(() => {
    if (!pendingChanges.length) return;

    const pendingChangesDataMap = pendingChanges.map(
      (change) => change.originId
    );
    if (isEqual(pendingChangesMap, pendingChangesDataMap)) return;
    refetch();
  }, [pendingChanges, pendingChangesMap, refetch]);

  const addChange = useCallback(
    (originId: string) => {
      setPendingChangesMap([...pendingChangesMap, originId]);
    },
    [pendingChangesMap]
  );

  const addEntity = useCallback(
    (entityId: string) => {
      addChange(entityId);
      refetch();
    },
    [addChange, refetch]
  );

  const addBlock = useCallback(
    (blockId: string) => {
      addChange(blockId);
      refetch();
    },
    [addChange, refetch]
  );

  const resetPendingChanges = useCallback(() => {
    setPendingChanges([]);
    setPendingChangesMap([]);
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

  const pendingChangesByResource = useMemo(() => {
    const groupedChanges = groupBy(
      pendingChanges,
      (change) => change.resource.id
    );

    return Object.entries(groupedChanges).map(([resourceId, changes]) => {
      return {
        resource: changes[0].resource,
        changes: changes,
      };
    });
  }, [pendingChanges]);

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
    pendingChangesDataError,
    pendingChangesDataLoading,
    pendingChangesByResource,
  };
};

export default usePendingChanges;
