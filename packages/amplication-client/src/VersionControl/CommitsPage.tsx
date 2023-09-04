import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { match, useHistory } from "react-router-dom";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import CommitList from "./CommitList";
import CommitResourceList from "./CommitResourceList";
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

  const { currentProject, currentWorkspace, commitUtils } =
    useContext(AppContext);

  const handleOnLoadMoreClick = useCallback(() => {
    commitUtils.refetchCommitsData(false);
  }, [commitUtils.refetchCommitsData]);

  const currentCommit = useMemo(() => {
    return commitUtils.commits?.find((commit) => commit.id === commitId);
  }, [commitId, commitUtils.commits]);

  useEffect(() => {
    if (commitId) return;
    commitUtils.commits.length &&
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/commits/${commitUtils.commits[0].id}`
      );
  }, [
    commitId,
    commitUtils.commits,
    currentProject?.id,
    currentWorkspace?.id,
    history,
  ]);

  return (
    <PageContent
      className={moduleClass}
      pageTitle={`Commit Page ${commitId ? commitId : ""}`}
      sideContent={
        commitUtils.commits?.length ? (
          <CommitList
            commits={commitUtils.commits}
            error={commitUtils.commitsError}
            loading={commitUtils.commitsLoading}
            onLoadMoreClick={handleOnLoadMoreClick}
            disableLoadMore={commitUtils.disableLoadMore}
          />
        ) : null
      }
    >
      {commitUtils.commits.length && currentCommit ? (
        <CommitResourceList
          commit={currentCommit}
          commitChangesByResource={commitUtils.commitChangesByResource}
        />
      ) : commitUtils.commitsLoading ? (
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
