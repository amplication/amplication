import React, { useContext, useEffect } from "react";
import { match, useHistory } from "react-router-dom";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { Commit } from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import CommitList from "./CommitList";
import CommitResourceList from "./CommitResourceList";
import useCommit from "./hooks/useCommits";
import "./CommitsPage.scss";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const getCommitIdx = (commits: Commit[], commitId: string): number =>
  commits.findIndex((commit) => commit.id === commitId);

const CommitsPage: React.FC<Props> = ({ match, moduleClass }) => {
  const commitId = match.params.commit;
  const history = useHistory();
  const { currentProject, currentWorkspace } = useContext(AppContext);
  const { commits, commitsError, commitsLoading } = useCommit();
  const commitIdx = getCommitIdx(commits, commitId);
  const commitsBuildsState =
    commits.length > 0 && commitIdx > -1 && commits[commitIdx].builds?.length;

  const commitsState = commits.length > 0;

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
        commitsState ? (
          <CommitList
            commits={commits}
            error={commitsError}
            loading={commitsLoading}
          />
        ) : null
      }
    >
      {commitsBuildsState ? (
        <CommitResourceList
          builds={commits[commitIdx].builds}
          commitId={commitId}
        />
      ) : (
        <div className={`${moduleClass}__empty-state`}>
          <SvgThemeImage image={EnumImages.CommitEmptyState} />
          {!commitsState && <p>There are no commits to show</p>}
          {commitsState && !commitsBuildsState && <p>There are no builds to show</p>}
        </div>
      )}
    </PageContent>
  );
};

export default CommitsPage;
