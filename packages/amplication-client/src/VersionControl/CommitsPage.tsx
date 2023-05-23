import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { match, useHistory } from "react-router-dom";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import CommitList from "./CommitList";
import CommitResourceList from "./CommitResourceList";
import useCommit from "./hooks/useCommits";
import "./CommitsPage.scss";
import { EmptyState } from "../Components/EmptyState";
import { CircularProgress } from "@amplication/ui/design-system";
import { Commit } from "../models";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const MAX_ITEMS_PER_LOADING = 20;

const CommitsPage: React.FC<Props> = ({ match, moduleClass }) => {
  const commitId = match.params.commit;
  const history = useHistory();

  const { currentProject, currentWorkspace } = useContext(AppContext);
  const [commitsCount, setCommitsCount] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(false);

  const { commits, commitsError, commitsLoading, refetchCommits } = useCommit(
    MAX_ITEMS_PER_LOADING
  );

  const [commitsData, setCommitsData] = useState<Commit[]>([]);

  useEffect(() => {
    if (commits?.length < 0 || commitsCount > 1) return;
    setCommitsData(commits);
  }, [commits]);

  useEffect(() => {
    setCommitsCount(1);
  }, []);

  const handleOnLoadMoreClick = useCallback(() => {
    setCommitsCount(commitsCount + 1);
    const getNextCommits = {
      variables: {
        skip: commitsCount * MAX_ITEMS_PER_LOADING,
        take: MAX_ITEMS_PER_LOADING,
      },
    };

    refetchCommits(getNextCommits.variables).then((results) => {
      setCommitsData([...commitsData, ...results.data.commits]);
      !results.data.commits.length && setDisableLoadMore(true);
    });
  }, [commitsData, refetchCommits, setCommitsData, setDisableLoadMore]);

  const currentCommit = useMemo(() => {
    return commitsData?.find((commit) => commit.id === commitId);
  }, [commitId, commitsData]);

  useEffect(() => {
    if (commitId) return;
    commitsData.length &&
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/commits/${commitsData[0].id}`
      );
  }, [
    commitId,
    commitsData,
    currentProject?.id,
    currentWorkspace?.id,
    history,
  ]);

  return (
    <PageContent
      className={moduleClass}
      pageTitle={`Commit Page ${commitId ? commitId : ""}`}
      sideContent={
        commitsData.length ? (
          <CommitList
            commits={commitsData}
            error={commitsError}
            loading={commitsLoading}
            onLoadMoreClick={handleOnLoadMoreClick}
            disableLoadMore={disableLoadMore}
          />
        ) : null
      }
    >
      {commitsData.length && currentCommit ? (
        <CommitResourceList commit={currentCommit} />
      ) : commitsLoading ? (
        <CircularProgress centerToParent />
      ) : (
        <EmptyState
          message="There are no commits to show"
          image={EnumImages.CommitEmptyState}
        />
      )}
    </PageContent>
  );
};

export default CommitsPage;
