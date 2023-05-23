import { GET_COMMITS } from "./commitQueries";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Commit, PendingChange, SortOrder } from "../../models";
import { useMutation, useQuery } from "@apollo/client";
import { AppContext } from "../../context/appContext";
import { groupBy } from "lodash";

const MAX_ITEMS_PER_LOADING = 20;

type CommitData = {
  commits: Commit[];
};
export type CommitChangesByResource = (commitId: string) => {
  resourceId: string;
  changes: PendingChange[];
}[];

const useCommits = (maxCommits?: number) => {
  const { currentProject } = useContext(AppContext);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [commitsCount, setCommitsCount] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [fetchCommits, { error: commitsError, loading: commitsLoading }] =
    useMutation<CommitData>(GET_COMMITS);
  // const {
  //   data: commitsData,
  //   error: commitsError,
  //   loading: commitsLoading,
  //   refetch: refetchCommits,
  // } = useQuery(GET_COMMITS, {
  //   skip: !currentProject?.id && !commits.length,
  //   notifyOnNetworkStatusChange: true,
  //   variables: {
  //     projectId: currentProject?.id,
  //     take: maxCommits || MAX_ITEMS_PER_LOADING,
  //     skip: 0,
  //     orderBy: {
  //       createdAt: SortOrder.Desc,
  //     },
  //   },
  // });
  const initialFetchCommits = useCallback(() => {
    fetchCommits({
      variables: {
        projectId: currentProject?.id,
        take: maxCommits || MAX_ITEMS_PER_LOADING,
        skip: 0,
        orderBy: {
          createdAt: SortOrder.Desc,
        },
      },
    });
  }, []);

  const refetchCommitsData = useCallback(
    (baseCommitsCount?: number) => {
      setCommitsCount(commitsCount + 1);
      const getNextCommits = {
        variables: {
          skip: baseCommitsCount || commitsCount * MAX_ITEMS_PER_LOADING,
          take: MAX_ITEMS_PER_LOADING,
        },
      };
      refetchCommits(getNextCommits.variables);
    },
    [refetchCommits, setCommitsCount, commitsCount]
  );

  useEffect(() => {
    if (!commitsData?.commits?.length) return;
    console.log("fetch commits");
    setCommits([...commits, ...commitsData.commits]);
    !commitsData?.commits?.length && setDisableLoadMore(true);
  }, [commitsData?.commits]);

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
    lastCommit: (commits && commits.length && commits[0]) || null,
    commitsError,
    commitsLoading,
    commitChangesByResource,
    refetchCommitsData,
    refetchCommits,
    disableLoadMore,
  };
};

export default useCommits;
