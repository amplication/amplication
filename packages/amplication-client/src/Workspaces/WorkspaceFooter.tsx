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

type TData = {
  commits: models.Commit[];
};

const CLASS_NAME = "workspace-footer";

const WorkspaceFooter: React.FC<{}> = () => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    commitRunning,
  } = useContext(AppContext);
  const gitRepositoryFullName = `${currentResource?.gitRepository?.gitOrganization.name}/${currentResource?.gitRepository?.name}`;
  const repoUrl = `https://github.com/${gitRepositoryFullName}`;

  const { data, loading, refetch } = useQuery<TData>(GET_LAST_COMMIT, {
    variables: {
      projectId: currentProject?.id,
      skip: !currentProject?.id,
    },
  });

  const lastCommit = useMemo(() => {
    if (loading || isEmpty(data?.commits)) return null;
    const [last] = data?.commits || [];
    refetch();
    return last;
  }, [loading, data?.commits, refetch]);

  const lastBuild = useMemo(() => {
    if (!lastCommit) return null;
    const [last] = lastCommit.builds || [];
    refetch();
    return last;
  }, [lastCommit, refetch]);

  const handleBuildLinkClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

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

  const ClickableBuildId = lastBuild && (
    <ClickableId
      label="Build ID"
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${lastBuild.resourceId}/builds/${lastBuild.id}`}
      id={lastBuild.id}
      onClick={handleBuildLinkClick}
      eventData={{
        eventName: "commitListBuildIdClick",
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
        <GitStatusConnectedDetails
          gitRepositoryFullName={gitRepositoryFullName}
          repoUrl={repoUrl}
        />
      </div>
      <div className={`${CLASS_NAME}__right`}>
        <SkeletonWrapper
          showSkeleton={commitRunning}
          className={`${CLASS_NAME}__skeleton`}
        >
          <span className={`${CLASS_NAME}__commit-id`}>
            {ClickableCommitId}
          </span>
          <span className={`${CLASS_NAME}__build-id`}>{ClickableBuildId}</span>
        </SkeletonWrapper>
      </div>
    </div>
  );
};

export default WorkspaceFooter;
