import React, { useCallback, useContext, useMemo } from "react";
import { Icon, SkeletonWrapper } from "@amplication/design-system";
import { isEmpty } from "lodash";
import { GET_LAST_COMMIT } from "../VersionControl/hooks/commitQueries";

import { ClickableId } from "../Components/ClickableId";
import { AppContext } from "../context/appContext";
import GitStatusConnectedDetails from "../Resource/git/GitStatusConnectedDetails";
import "./WorkspaceFooter.scss";
import * as models from "../models";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_LAST_BUILD } from "../VersionControl/LastBuild";

type TDataCommit = {
  commits: models.Commit[];
};

type TDataBuild = {
  builds: models.Build[];
};

const CLASS_NAME = "workspace-footer";

const WorkspaceFooter: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    commitRunning,
    gitRepositoryFullName,
    projectConfigurationResource,
  } = useContext(AppContext);
  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  const { data: commitsData, loading: commitsLoading } = useQuery<TDataCommit>(
    GET_LAST_COMMIT,
    {
      variables: {
        projectId: currentProject?.id,
      },
      skip: !currentProject?.id
    }
  );

  console.log(currentResource, "currentResource");

  const { data: buildsData, loading: buildsLoading } = useQuery<TDataBuild>(
    GET_LAST_BUILD,
    {
      variables: {
        resourceId: currentResource?.id,
      },
      skip: !currentResource?.id,
    }
  );

  const lastCommit = useMemo(() => {
    if (commitsLoading || isEmpty(commitsData?.commits)) return null;
    const [last] = commitsData?.commits || [];
    return last;
  }, [commitsLoading, commitsData]);

  const lastResourceBuild = useMemo(() => {
    if (buildsLoading || isEmpty(buildsData?.builds)) return null;
    const [last] = buildsData?.builds || [];
    return last;
  }, [buildsLoading, buildsData]);

  // const lastResourceBuild = useMemo(() => {
  //   if (!lastCommit) return null;
  //   if (lastCommit.builds && lastCommit.builds.length && currentResource?.id) {
  //     return lastCommit.builds.find(
  //       (lastCommitBuild) => lastCommitBuild.resourceId === currentResource.id
  //     );
  //   }
  // }, [currentResource?.id, lastCommit]);

  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const ClickableCommitId = lastCommit && (
    <ClickableId
      to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${lastCommit.id}`}
      id={lastCommit.id}
      label="Commit ID"
      onClick={handleBuildLinkClick}
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
      onClick={handleBuildLinkClick}
      eventData={{
        eventName: "lastBuildIdClick",
      }}
    />
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__left`}>
        <Icon
          icon="github"
          size="small"
          className={`${CLASS_NAME}__github-icon`}
        />
        {gitRepositoryFullName.includes("/") ? (
          <GitStatusConnectedDetails
            gitRepositoryFullName={gitRepositoryFullName}
            repoUrl={repoUrl}
          />
        ) : (
          <Link
            title={"Connect to GitHub"}
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/github`}
          >
            Connect to GitHub
          </Link>
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
