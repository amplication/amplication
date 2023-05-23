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

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const CommitsPage: React.FC<Props> = ({ match, moduleClass }) => {
  const commitId = match.params.commit;
  const history = useHistory();

  const { currentProject, currentWorkspace } = useContext(AppContext);

  const {
    commits,
    commitsError,
    commitsLoading,
    refetchCommitsData,
    disableLoadMore,
    commitChangesByResource,
  } = useCommit();

  const handleOnLoadMoreClick = useCallback(() => {
    refetchCommitsData();
  }, [refetchCommitsData]);

  const currentCommit = useMemo(() => {
    return commits?.find((commit) => commit.id === commitId);
  }, [commitId, commits]);

  useEffect(() => {
    if (commitId) return;
    commits.length &&
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/commits/${commits[0].id}`
      );
  }, [commitId, commits, currentProject?.id, currentWorkspace?.id, history]);

  return (
    <PageContent
      className={moduleClass}
      pageTitle={`Commit Page ${commitId ? commitId : ""}`}
      sideContent={
        commits.length ? (
          <CommitList
            commits={commits}
            error={commitsError}
            loading={commitsLoading}
            onLoadMoreClick={handleOnLoadMoreClick}
            disableLoadMore={disableLoadMore}
          />
        ) : null
      }
    >
      {commits.length && currentCommit ? (
        <CommitResourceList
          commit={currentCommit}
          commitChangesByResource={commitChangesByResource}
        />
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
