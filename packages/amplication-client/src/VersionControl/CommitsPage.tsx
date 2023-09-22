import React, { useCallback, useContext, useEffect } from "react";
import { match, useHistory } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import CommitList from "./CommitList";
import "./CommitsPage.scss";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const PAGE_TITLE = "Commits";

const CommitsPage: React.FC<Props> = ({ match, moduleClass, innerRoutes }) => {
  const commitId = match.params.commit;
  const history = useHistory();

  const { currentProject, currentWorkspace, commitUtils } =
    useContext(AppContext);

  const handleOnLoadMoreClick = useCallback(() => {
    commitUtils.refetchCommitsData(false);
  }, [commitUtils.refetchCommitsData]);

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
      pageTitle={PAGE_TITLE}
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
      {innerRoutes}
    </PageContent>
  );
};

export default CommitsPage;
