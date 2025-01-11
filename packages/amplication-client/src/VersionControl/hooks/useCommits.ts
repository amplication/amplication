import { COMMIT_CHANGES, GET_COMMITS, GET_LAST_COMMIT } from "./commitQueries";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Commit,
  PendingChange,
  SortOrder,
  Build,
  EnumBuildStatus,
  EnumSubscriptionPlan,
  CommitCreateInput,
  EnumResourceTypeGroup,
} from "../../models";
import {
  ApolloError,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import { cloneDeep, groupBy } from "lodash";
import { GraphQLErrorCode } from "@amplication/graphql-error-codes";
import { AppContext } from "../../context/appContext";
import { commitPath } from "../../util/paths";
import { useHistory } from "react-router-dom";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import { GET_OUTDATED_VERSION_ALERTS } from "../../OutdatedVersionAlerts/hooks/outdatedVersionAlertsQueries";

const MAX_ITEMS_PER_LOADING = 20;
const POLL_INTERVAL = 1000; //update the last commit status frequently to get the latest log message

export type CommitChangesByResource = (commitId: string) => {
  resourceId: string;
  changes: PendingChange[];
}[];

type TData = {
  commit: Commit;
};

type BillingError = {
  message: string;
  billingFeature: string;
};

export interface CommitUtils {
  commits: Commit[];
  lastCommit: Commit;
  commitsError: ApolloError;
  commitsLoading: boolean;
  commitChangesByResource: (commitId: string) => {
    resourceId: string;
    changes: PendingChange[];
  }[];
  refetchCommitsData: (refetchFromStart?: boolean) => void;
  refetchLastCommit: () => void;
  updateBuildStatus: (build: Build) => void;
  disableLoadMore: boolean;
}

const useCommits = (currentProjectId: string, maxCommits?: number) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [lastCommit, setLastCommit] = useState<Commit>();
  const [commitsCount, setCommitsCount] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [isOpenLimitationDialog, setOpenLimitationDialog] = useState(false);
  const history = useHistory();

  const {
    setCommitRunning,
    resetPendingChanges,
    setPendingChangesError,
    currentWorkspace,
    commitUtils,
    reloadResources,
  } = useContext(AppContext);

  const { baseUrl: projectBaseUrl } = useProjectBaseUrl();

  const updateBuildStatus = useCallback(
    (build: Build) => {
      const clonedCommits = cloneDeep(commits);
      //find the commit that contains the build
      const commitIdx = getCommitIdx(clonedCommits, build.commitId);
      if (commitIdx === -1) return;
      const commit = clonedCommits[commitIdx];

      //find the build in the commit
      const buildIdx = commit.builds.findIndex((b) => b.id === build.id);
      if (buildIdx === -1) return;
      const builds = [...commit.builds];

      //update the build status if it changed
      if (builds[buildIdx].status === build.status) {
        return;
      }

      builds[buildIdx].status = build.status;
      builds[buildIdx].action = build.action;

      setCommits(clonedCommits);
      if (lastCommit.id === build.commitId) {
        setLastCommit(commit);
      }
    },
    [commits, lastCommit]
  );

  const {
    startPolling: getLastCommitStartPolling,
    stopPolling: getLastCommitStopPolling,
  } = useQuery<{ commits: Commit[] }>(GET_LAST_COMMIT, {
    skip: !currentProjectId,
    variables: {
      projectId: currentProjectId,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const updatedLastCommit = data.commits[0];
      //only update in case the current last commit is still the last commit
      if (updatedLastCommit && updatedLastCommit.id === lastCommit?.id) {
        setLastCommit(updatedLastCommit);

        const clonedCommits = cloneDeep(commits);
        //find the commit that contains the build
        const commitIdx = getCommitIdx(clonedCommits, updatedLastCommit.id);
        if (commitIdx === -1) return;
        clonedCommits[commitIdx] = updatedLastCommit;
        setCommits(clonedCommits);
      }
    },
  });

  //poll for the last commit status as long as there are running builds
  useEffect(() => {
    let shouldPoll = false;

    if (lastCommit && lastCommit.builds && lastCommit.builds.length > 0) {
      const runningBuilds = lastCommit.builds.some(
        (build) => build.status === EnumBuildStatus.Running
      );
      if (runningBuilds) {
        shouldPoll = true;
      }
    }

    if (shouldPoll && currentProjectId) {
      getLastCommitStartPolling(POLL_INTERVAL);
    } else {
      getLastCommitStopPolling();
    }
  }, [
    getLastCommitStopPolling,
    getLastCommitStartPolling,
    lastCommit,
    currentProjectId,
  ]);

  //cleanup polling
  useEffect(() => {
    return () => {
      getLastCommitStopPolling();
    };
  }, [getLastCommitStopPolling]);

  const formatLimitationError = (errorMessage: string) => {
    const LIMITATION_ERROR_PREFIX = "LimitationError: ";

    const limitationError = errorMessage.split(LIMITATION_ERROR_PREFIX)[1];
    return limitationError;
  };

  //commits mutation
  const [commit, { error: commitChangesError, loading: commitChangesLoading }] =
    useMutation<TData>(COMMIT_CHANGES, {
      refetchQueries: [GET_OUTDATED_VERSION_ALERTS],
      update: (cache, { data }) => {
        //evict the cache of all alert after commit
        cache.evict({ fieldName: "resourceVersions" });
      },
      onError: (error: ApolloError) => {
        setCommitRunning(false);
        setPendingChangesError(true);

        setOpenLimitationDialog(
          error?.graphQLErrors?.some(
            (gqlError) =>
              gqlError.extensions.code ===
              GraphQLErrorCode.BILLING_LIMITATION_ERROR
          ) ?? false
        );
      },
    });

  const commitChanges = useCallback(
    (data: CommitCreateInput) => {
      if (!data) return;
      setCommitRunning(true);
      commit({
        variables: {
          data: data,
        },
      })
        .then((response) => {
          setCommitRunning(false);
          setPendingChangesError(false);
          resetPendingChanges();
          reloadResources();
          commitUtils.refetchCommitsData(true);
          if (data.resourceTypeGroup === EnumResourceTypeGroup.Services) {
            const path = commitPath(projectBaseUrl, response.data.commit.id);
            history.push(path);
          }
        })
        .catch(console.error);
    },
    [
      commit,
      commitUtils,
      history,
      projectBaseUrl,
      reloadResources,
      resetPendingChanges,
      setCommitRunning,
      setPendingChangesError,
    ]
  );

  const bypassLimitations = useMemo(() => {
    return (
      currentWorkspace?.subscription?.subscriptionPlan !==
      EnumSubscriptionPlan.Pro
    );
  }, [currentWorkspace]);

  const commitChangesLimitationError = useMemo((): BillingError => {
    if (!commitChangesError) return;
    const limitation = commitChangesError?.graphQLErrors?.find(
      (gqlError) =>
        gqlError.extensions.code === GraphQLErrorCode.BILLING_LIMITATION_ERROR
    );
    if (!limitation) return;

    const results = {
      message: formatLimitationError(limitation.message),
      billingFeature: limitation.extensions.billingFeature as string,
    };

    return results;
  }, [commitChangesError]);

  const {
    data: commitsData,
    error: commitsError,
    loading: commitsLoading,
    refetch: refetchCommits,
  } = useQuery(GET_COMMITS, {
    notifyOnNetworkStatusChange: true,
    skip: !currentProjectId,
    variables: {
      projectId: currentProjectId,
      resourceTypeGroup: EnumResourceTypeGroup.Services,
      take: maxCommits || MAX_ITEMS_PER_LOADING,
      skip: 0,
      orderBy: {
        createdAt: SortOrder.Desc,
      },
    },
    onCompleted: (data) => {
      if (!data?.commits.length || data?.commits.length < MAX_ITEMS_PER_LOADING)
        setDisableLoadMore(true);
    },
  });

  // fetch the initial commit data and assign it
  useEffect(() => {
    if (!commitsData && !commitsData?.commits.length) return;

    if (commits.length) return;

    if (commitsLoading) return;

    setCommits(commitsData?.commits);

    setLastCommit(commitsData?.commits[0]);
  }, [commitsData?.commits, commits, commitsData, commitsLoading]);

  //refetch next page of commits, or refetch from start
  const refetchCommitsData = useCallback(
    (refetchFromStart?: boolean) => {
      refetchCommits({
        skip: refetchFromStart ? 0 : commitsCount * MAX_ITEMS_PER_LOADING,
        take: MAX_ITEMS_PER_LOADING,
      });
      refetchFromStart && setCommits([]);
      setCommitsCount(refetchFromStart ? 1 : commitsCount + 1);
    },
    [refetchCommits, setCommitsCount, commitsCount]
  );

  //refetch from the server the most updated commit
  const refetchLastCommit = useCallback(() => {
    if (!currentProjectId) return;

    refetchCommits({
      skip: 0,
      take: 1,
    });
  }, [currentProjectId, refetchCommits]);

  // pagination refetch - we received an updated list from the server, and we need to append it to the current list
  useEffect(() => {
    if (!commitsData?.commits?.length || commitsCount === 1 || commitsLoading)
      return;

    setCommits([...commits, ...commitsData.commits]);
  }, [commitsData?.commits, commitsCount]);

  const getCommitIdx = (commits: Commit[], commitId: string): number =>
    commits.findIndex((commit) => commit.id === commitId);

  const commitChangesByResource = useMemo(
    () => (commitId: string) => {
      const commitIdx = getCommitIdx(commits, commitId);
      const changesByResource = groupBy(
        commits[commitIdx]?.changes,
        (originChange) => {
          if (!originChange.resource) return;
          return originChange.resource.id;
        }
      );
      return Object.entries(changesByResource).map(([resourceId, changes]) => {
        return {
          resourceId,
          changes,
        };
      });
    },
    [commits]
  );

  return {
    commits,
    lastCommit,
    commitsError,
    commitsLoading,
    commitChangesByResource,
    refetchCommitsData,
    refetchLastCommit,
    disableLoadMore,
    updateBuildStatus,
    isOpenLimitationDialog,
    commitChanges,
    commitChangesError,
    commitChangesLoading,
    commitChangesLimitationError,
    bypassLimitations,
  };
};

export default useCommits;
