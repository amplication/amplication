import React, { useContext, useMemo } from "react";
import { Icon, SkeletonWrapper } from "@amplication/design-system";
import { isEmpty } from "lodash";
import { GET_LAST_COMMIT_BUILDS } from "../VersionControl/hooks/commitQueries";

import { ClickableId } from "../Components/ClickableId";
import { AppContext } from "../context/appContext";
import GitRepoDetails from "../Resource/git/GitRepoDetails";
import "./WorkspaceFooter.scss";
import * as models from "../models";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

type TDataCommit = {
  commits: models.Commit[];
};

const CLASS_NAME = "workspace-footer";

const WorkspaceFooter: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    commitRunning,
    gitRepositoryFullName,
    gitRepositoryUrl,
    projectConfigurationResource,
  } = useContext(AppContext);

  const { data: commitsData, loading: commitsLoading } = useQuery<TDataCommit>(
    GET_LAST_COMMIT_BUILDS,
    {
      variables: {
        projectId: currentProject?.id,
      },
      skip: !currentProject?.id,
    }
  );

  const lastCommit = useMemo(() => {
    if (commitsLoading || isEmpty(commitsData?.commits)) return null;
    const [last] = commitsData?.commits || [];
    return last;
  }, [commitsLoading, commitsData]);

  const lastResourceBuild = useMemo(() => {
    if (!lastCommit) return null;
    if (lastCommit.builds && currentResource?.id) {
      return lastCommit.builds.find(
        (lastCommitBuild) => lastCommitBuild.resourceId === currentResource.id
      );
    }
  }, [currentResource?.id, lastCommit]);

  const ClickableCommitId = lastCommit && (
    <ClickableId
      to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${lastCommit.id}`}
      id={lastCommit.id}
      label="Commit ID"
      eventData={{
        eventName: "lastCommitIdClick",
      }}
    />
  );

  const ClickableBuildId = lastResourceBuild && (
    <ClickableId
      label="Build ID"
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${lastResourceBuild.resourceId}/builds/${lastResourceBuild.id}`}
      id={lastResourceBuild.id}
      eventData={{
        eventName: "lastBuildIdClick",
      }}
    />
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__left`}>
        {gitRepositoryFullName.includes("/") ? (
          <div className={`${CLASS_NAME}__gh-connection`}>
            <Icon
              icon="github"
              size="small"
              className={`${CLASS_NAME}__github-icon`}
            />
            <GitRepoDetails />
            <a
              className={`${CLASS_NAME}__gh-link`}
              href={gitRepositoryUrl}
              target="github"
            >
              Open With GitHub
            </a>
          </div>
        ) : (
          <div className={`${CLASS_NAME}__gh-disconnected`}>
            <Icon
              icon="github"
              size="small"
              className={`${CLASS_NAME}__github-icon`}
            />
            <Link
              className={`${CLASS_NAME}__connect-to-gh`}
              title={"Connect to GitHub"}
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/github`}
            >
              Connect to GitHub
            </Link>
          </div>
        )}
      </div>
      <div className={`${CLASS_NAME}__right`}>
        <SkeletonWrapper
          showSkeleton={commitRunning}
          className={`${CLASS_NAME}__skeleton`}
        >
          <span className={`${CLASS_NAME}__commit-id`}>
            {ClickableCommitId}
          </span>
          {lastResourceBuild && (
            <hr className={`${CLASS_NAME}__vertical_border`} />
          )}
          <span className={`${CLASS_NAME}__build-id`}>{ClickableBuildId}</span>
        </SkeletonWrapper>
      </div>
    </div>
  );
};

export default WorkspaceFooter;
