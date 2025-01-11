import {
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Panel,
  TabContentTitle,
  Toggle,
} from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import React, { useCallback, useState } from "react";
import {
  CONNECT_RESOURCE_PROJECT_REPO,
  DISCONNECT_GIT_REPOSITORY,
} from "../../Workspaces/queries/resourcesQueries";
import * as models from "../../models";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import ResourceGitSettings from "./ResourceGitSettings";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";

const CLASS_NAME = "service-configuration-git-settings";

type Props = {
  resource: models.Resource;
  gitRepositorySelectedCb: (data: GitRepositorySelected) => void;
  gitRepositoryCreatedCb?: (data: GitRepositoryCreatedData) => void;
};

type TData = {
  updateResource: models.Resource;
};

const ResourceGitSettingsWithOverride: React.FC<Props> = ({
  resource,
  gitRepositorySelectedCb,
  gitRepositoryCreatedCb,
}) => {
  const [isOverride, setIsOverride] = useState<boolean>(
    resource.gitRepositoryOverride
  );

  const [connectResourceToProjectRepository] = useMutation<TData>(
    CONNECT_RESOURCE_PROJECT_REPO,
    {
      variables: { resourceId: resource.id },
    }
  );

  const [disconnectGitRepository] = useMutation(DISCONNECT_GIT_REPOSITORY, {
    variables: { resourceId: resource.id },
  });

  const handleDisconnectGitRepository = useCallback(
    (overrideProjectSettings: boolean) => {
      disconnectGitRepository({
        variables: {
          resourceId: resource.id,
          overrideProjectSettings,
        },
      }).catch(console.error);
    },
    [disconnectGitRepository, resource.id]
  );

  const handleConnectProjectGitRepository = useCallback(() => {
    connectResourceToProjectRepository({
      variables: { resourceId: resource.id },
    }).catch(console.error);
  }, [connectResourceToProjectRepository, resource.id]);

  const handleResourceStatusChanged = useCallback(
    (isOverride: boolean) => {
      setIsOverride(isOverride);
      if (isOverride) {
        handleDisconnectGitRepository(true);
      } else {
        handleConnectProjectGitRepository();
      }
    },
    [handleDisconnectGitRepository, handleConnectProjectGitRepository]
  );

  const handleToggleChange = useCallback(
    (gitRepositoryOverride) => {
      handleResourceStatusChanged(gitRepositoryOverride);
    },
    [handleResourceStatusChanged]
  );

  return (
    <div className={CLASS_NAME}>
      <TabContentTitle title="Sync with Git Provider" />

      <Panel panelStyle={EnumPanelStyle.Surface}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <Toggle
            label="Override project settings"
            onValueChange={handleToggleChange}
            checked={isOverride}
          />
        </FlexItem>
      </Panel>

      {!isOverride && (
        <ProjectConfigurationGitSettings isOverride={isOverride} />
      )}

      {isOverride && (
        <>
          <ResourceGitSettings
            type="resource"
            resource={resource}
            gitRepositorySelectedCb={gitRepositorySelectedCb}
            gitRepositoryCreatedCb={gitRepositoryCreatedCb}
          />
        </>
      )}
    </div>
  );
};

export default ResourceGitSettingsWithOverride;
