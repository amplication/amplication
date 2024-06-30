import { GET_COMMITS } from "./commitQueries";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Commit,
  PendingChange,
  SortOrder,
  Build,
  EnumBuildStatus,
} from "../../models";
import { ApolloError, useLazyQuery } from "@apollo/client";
import { cloneDeep, groupBy } from "lodash";

const MAX_ITEMS_PER_LOADING = 20;
const POLL_INTERVAL = 1000; //update the last commit status frequently to get the latest log message

export type CommitChangesByResource = (commitId: string) => {
  resourceId: string;
  changes: PendingChange[];
}[];

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

  const [
    getLastCommit,
    {
      data: getLastCommitData,
      startPolling: getLastCommitStartPolling,
      stopPolling: getLastCommitStopPolling,
    },
  ] = useLazyQuery<{ commits: Commit[] }>(GET_COMMITS, {
    variables: {
      projectId: currentProjectId,
      skip: 0,
      take: 1,
      orderBy: {
        createdAt: SortOrder.Desc,
      },
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

    if (shouldPoll) {
      getLastCommitStartPolling(POLL_INTERVAL);
    } else {
      getLastCommitStopPolling();
    }
  }, [getLastCommitStopPolling, getLastCommitStartPolling, lastCommit]);

  //cleanup polling
  useEffect(() => {
    return () => {
      getLastCommitStopPolling();
    };
  }, [getLastCommitStopPolling]);

  const [
    getInitialCommits,
    {
      data: commitsData,
      error: commitsError,
      loading: commitsLoading,
      refetch: refetchCommits,
    },
  ] = useLazyQuery(GET_COMMITS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      projectId: currentProjectId,
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

  // get initial commits for a specific project
  useEffect(() => {
    if (!currentProjectId) return;

    getInitialCommits();
    commitsCount !== 1 && setCommitsCount(1);
  }, [currentProjectId]);

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
  };
};

export default useCommits;
