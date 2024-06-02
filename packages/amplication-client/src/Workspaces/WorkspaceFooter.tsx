import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  SkeletonWrapper,
  Text,
} from "@amplication/ui/design-system";
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClickableId } from "../Components/ClickableId";
import GitRepoDetails from "../Resource/git/GitRepoDetails";
import { gitProviderIconMap } from "../Resource/git/git-provider-icon-map";
import useBuildGitUrl from "../VersionControl/useBuildGitUrl";
import { AppContext } from "../context/appContext";
import { Commit } from "../models";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./WorkspaceFooter.scss";

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

  const gitUrl = useBuildGitUrl(lastResourceBuild);

  return (
    currentProject && (
      <div className={CLASS_NAME}>
        <>
          <div className={`${CLASS_NAME}__left`}>
            {gitRepositoryFullName && gitRepositoryOrganizationProvider ? (
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                gap={EnumGapSize.Small}
              >
                <Icon
                  icon={gitProviderIconMap[gitRepositoryOrganizationProvider]}
                  size="small"
                  color={EnumTextColor.Black20}
                />

                <a
                  className={`${CLASS_NAME}__git-link`}
                  href={gitUrl || gitRepositoryUrl}
                  target={
                    gitRepositoryOrganizationProvider?.toLocaleLowerCase() ||
                    "_blank"
                  }
                >
                  <Text textStyle={EnumTextStyle.Description}>
                    <GitRepoDetails
                      gitRepositoryFullName={gitRepositoryFullName}
                    />
                  </Text>
                </a>
              </FlexItem>
            ) : (
              <FlexItem
                itemsAlign={EnumItemsAlign.Center}
                gap={EnumGapSize.Small}
              >
                <Icon
                  icon="pending_changes"
                  size="small"
                  color={EnumTextColor.ThemeRed}
                />
                <Link
                  className={`${CLASS_NAME}__connect-to-git`}
                  title={`Connect to git`}
                  to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/git-sync`}
                >
                  <Text
                    textStyle={EnumTextStyle.Description}
                    textColor={EnumTextColor.ThemeRed}
                  >
                    Connect to git
                  </Text>
                </Link>
              </FlexItem>
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
              <span className={`${CLASS_NAME}__build-id`}>
                {ClickableBuildId}
              </span>
            </SkeletonWrapper>
          </div>
        </>
      </div>
    )
  );
};

export default WorkspaceFooter;
