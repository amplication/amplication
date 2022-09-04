import { GET_COMMITS } from "./commitQueries";
import { useContext, useEffect, useMemo, useState } from "react";
import { Commit, SortOrder } from "../../models";
import { useQuery } from "@apollo/client";
import { AppContext } from "../../context/appContext";
import { groupBy } from "lodash";

const useCommits = () => {
  const { currentProject } = useContext(AppContext);
  const [commits, setCommits] = useState<Commit[]>([]);

  const {
    data: commitsData,
    error: commitsError,
    loading: commitsLoading,
    refetch,
  } = useQuery(GET_COMMITS, {
    skip: !currentProject?.id && !commits.length,
    variables: {
      projectId: currentProject?.id,
      orderBy: {
        createdAt: SortOrder.Desc,
      },
    },
  });

  useEffect(() => {
    if (!commitsData) return;
    setCommits(commitsData.commits);
    refetch();
  }, [commitsData, refetch]);

  const getCommitIdx = (commits: Commit[], commitId: string): number =>
    commits.findIndex((commit) => commit.id === commitId);

  const commitChangesByResource = useMemo(
    () => (commitId: string) => {
      const commitIdx = getCommitIdx(commits, commitId);
      const changesByResource = groupBy(
        commits[commitIdx]?.changes,
        (originChange) => {
          if (!originChange.origin.resource) return;
          return originChange.origin.resource.id;
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
    commitsError,
    commitsLoading,
    commitChangesByResource,
  };
};

export default useCommits;
