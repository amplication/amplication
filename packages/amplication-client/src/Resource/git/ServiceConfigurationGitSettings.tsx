import { HorizontalRule, Toggle } from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import React, { useCallback, useState } from "react";
import {
  CONNECT_RESOURCE_PROJECT_REPO,
  DISCONNECT_GIT_REPOSITORY,
  UPDATE_RESOURCE,
} from "../../Workspaces/queries/resourcesQueries";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import AuthWithGitProvider from "./AuthWithGitProvider";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";

const CLASS_NAME = "service-configuration-git-settings";

type Props = {
  resource: models.Resource;
  onDone: () => void;
  gitRepositorySelectedCb: (data: GitRepositorySelected) => void;
  gitRepositoryCreatedCb?: (data: GitRepositoryCreatedData) => void;
};

type TData = {
  updateResource: models.Resource;
};

const ServiceConfigurationGitSettings: React.FC<Props> = ({
  resource,
  onDone,
  gitRepositorySelectedCb,
  gitRepositoryCreatedCb,
}) => {
  const [isOverride, setIsOverride] = useState<boolean>(
    resource.gitRepositoryOverride
  );

  const { trackEvent } = useTracking();

  const [connectResourceToProjectRepository] = useMutation<TData>(
    CONNECT_RESOURCE_PROJECT_REPO,
    {
      variables: { resourceId: resource.id },
    }
  );

  const [disconnectGitRepository] = useMutation(DISCONNECT_GIT_REPOSITORY, {
    variables: { resourceId: resource.id },
  });

  const handleDisconnectGitRepository = useCallback(() => {
    disconnectGitRepository({
      variables: { resourceId: resource.id },
    }).catch(console.error);
  }, [disconnectGitRepository, resource.id]);

  const handleConnectProjectGitRepository = useCallback(() => {
    connectResourceToProjectRepository({
      variables: { resourceId: resource.id },
    }).catch(console.error);
  }, [connectResourceToProjectRepository, resource.id]);

  const handleResourceStatusChanged = useCallback(
    (isOverride: boolean) => {
      setIsOverride(isOverride);
      if (isOverride) {
        handleDisconnectGitRepository();
      } else {
        handleConnectProjectGitRepository();
      }
    },
    [handleDisconnectGitRepository, handleConnectProjectGitRepository]
  );

  const [updateResourceOverrideStatus] = useMutation<TData>(UPDATE_RESOURCE, {
    onCompleted: (data) => {
      handleResourceStatusChanged(data.updateResource.gitRepositoryOverride);
    },
  });

  const handleToggleChange = useCallback(
    (gitRepositoryOverride) => {
      trackEvent({
        eventName: AnalyticsEventNames.ResourceInfoUpdate,
      });
      updateResourceOverrideStatus({
        variables: {
          data: {
            gitRepositoryOverride,
          },
          resourceId: resource.id,
        },
      }).catch(console.error);
    },
    [resource.id, trackEvent, updateResourceOverrideStatus]
  );

  return (
    <div className={CLASS_NAME}>
      <ProjectConfigurationGitSettings isOverride={isOverride} />
      <HorizontalRule doubleSpacing />
      <Toggle
        label="Override default settings"
        onValueChange={handleToggleChange}
        checked={isOverride}
      />

      {isOverride && (
        <>
          <AuthWithGitProvider
            type="resource"
            resource={resource}
            onDone={onDone}
            gitRepositorySelectedCb={gitRepositorySelectedCb}
            gitRepositoryCreatedCb={gitRepositoryCreatedCb}
          />
        </>
      )}
    </div>
  );
};

export default ServiceConfigurationGitSettings;
