import { Icon, SkeletonWrapper } from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import { AppContext } from "../context/appContext";
import GitRepoDetails from "../Resource/git/GitRepoDetails";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { PUSH_TO_GIT_STEP_NAME } from "../VersionControl/BuildSteps";
import "./WorkspaceFooter.scss";
import { Commit } from "../models";
import { gitProviderIconMap } from "../Resource/git/git-provider-icon-map";
import { gitProviderName } from "../Resource/git/gitProviderDisplayName";

const CLASS_NAME = "workspace-footer";

const WorkspaceFooter: React.FC<{ lastCommit: Commit }> = ({ lastCommit }) => {
  const {
    currentWorkspace,
    currentProject,
    currentResource,
    commitRunning,
    gitRepositoryFullName,
    gitRepositoryUrl,
    projectConfigurationResource,
    gitRepositoryOrganizationProvider,
  } = useContext(AppContext);

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
        eventName: AnalyticsEventNames.LastCommitIdClick,
      }}
    />
  );

  const ClickableBuildId = lastResourceBuild && (
    <ClickableId
      label="Build ID"
      to={`/${currentWorkspace?.id}/${currentProject?.id}/${lastResourceBuild.resourceId}/builds/${lastResourceBuild.id}`}
      id={lastResourceBuild.id}
      eventData={{
        eventName: AnalyticsEventNames.LastBuildIdClick,
      }}
    />
  );

  const gitUrl =
    useMemo(() => {
      if (!lastResourceBuild?.action?.steps?.length) {
        return gitRepositoryUrl;
      }
      const gitStep = lastResourceBuild?.action.steps.find(
        (step) =>
          step.name === PUSH_TO_GIT_STEP_NAME(gitRepositoryOrganizationProvider)
      );

      const log = gitStep?.logs?.find(
        (log) => !isEmpty(log.meta) && !isEmpty(log.meta.githubUrl)
      );
      // if there is "lastResourceBuild" link to the last PR
      return lastResourceBuild ? log?.meta?.githubUrl : gitRepositoryUrl;
    }, [gitRepositoryUrl, lastResourceBuild]) || gitRepositoryUrl;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__left`}>
        {gitRepositoryFullName && gitRepositoryOrganizationProvider ? (
          <div className={`${CLASS_NAME}__git-connection`}>
            <Icon
              icon={gitProviderIconMap[gitRepositoryOrganizationProvider]}
              size="small"
              className={`${CLASS_NAME}__git-icon`}
            />
            <GitRepoDetails gitRepositoryFullName={gitRepositoryFullName} />
            <a
              className={`${CLASS_NAME}__git-link`}
              href={gitUrl}
              target={
                gitRepositoryOrganizationProvider?.toLocaleLowerCase() ||
                "_blank"
              }
            >
              {`Open With ${gitProviderName[gitRepositoryOrganizationProvider]}`}
            </a>
          </div>
        ) : (
          <div className={`${CLASS_NAME}__git-disconnected`}>
            <Icon
              icon="pending_changes"
              size="small"
              className={`${CLASS_NAME}__git-icon`}
            />
            <Link
              className={`${CLASS_NAME}__connect-to-git`}
              title={`Connect to git`}
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/git-sync`}
            >
              Connect to git
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
