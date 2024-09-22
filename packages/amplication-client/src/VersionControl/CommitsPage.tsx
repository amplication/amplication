import React, { useCallback, useContext, useEffect } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import CommitList from "./CommitList";
import "./CommitsPage.scss";
import BuildPage from "./BuildPage";
import CommitButton from "./CommitButton";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { EnumCommitStrategy, EnumResourceTypeGroup } from "../models";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const PAGE_TITLE = "Commits";

const CommitsPage: React.FC<Props> = ({ moduleClass, innerRoutes }) => {
  const history = useHistory();

  const commitMatch = useRouteMatch<{
    workspace: string;
    project: string;
    commit: string;
    build?: string;
  }>("/:workspace/:project/commits/:commit");
  const { commit: commitId } = commitMatch?.params ?? {};

  const buildMatch = useRouteMatch<{
    workspace: string;
    project: string;
    commit: string;
    build?: string;
  }>("/:workspace/:project/commits/:commit/builds/:build");

  const { build: buildId } = buildMatch?.params ?? {};

  const { commitUtils } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const handleOnLoadMoreClick = useCallback(() => {
    commitUtils.refetchCommitsData(false);
  }, [commitUtils.refetchCommitsData]);

  useEffect(() => {
    if (commitId) return;
    commitUtils.commits.length &&
      history.push(`${baseUrl}/commits/${commitUtils.commits[0].id}`);
  }, [commitId, commitUtils.commits, baseUrl, history]);

  return buildId ? (
    <BuildPage match={undefined} buildId={buildId} />
  ) : (
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
      {buildId}
      {commitUtils.commits?.length ? (
        innerRoutes
      ) : (
        <>
          {commitUtils.commitsLoading ? (
            <EmptyState
              message="Loading commits..."
              image={EnumImages.CommitEmptyState}
            ></EmptyState>
          ) : (
            <EmptyState
              message="There are no commits to show. "
              image={EnumImages.CommitEmptyState}
            >
              <CommitButton
                resourceTypeGroup={EnumResourceTypeGroup.Services}
                hasMultipleServices={true}
                hasPendingChanges={true}
                commitStrategy={EnumCommitStrategy.All}
              />
            </EmptyState>
          )}
        </>
      )}
    </PageContent>
  );
};

export default CommitsPage;
