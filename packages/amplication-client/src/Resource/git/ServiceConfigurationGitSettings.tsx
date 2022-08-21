import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import React, { useCallback, useContext, useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ServiceConfigurationGitSettings.scss";
import AuthResourceWithGit from "./AuthResourceWithGit";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import { AppContext } from "../../context/appContext";
import {useMutation } from "@apollo/client";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { CONNECT_RESOURCE_PROJECT_REPO, DISCONNECT_GIT_REPOSITORY, UPDATE_RESOURCE } from "../../Workspaces/queries/resourcesQueries";

const CLASS_NAME = "service-configuration-github-settings";

type Props = {
  resource:  models.Resource;
  onDone: () => void;
};

type TData = {
  updateResource: models.Resource;
};

const ServiceConfigurationGitSettings: React.FC<Props> = ({
  resource,
  onDone,
}) => {
  const { currentWorkspace } = useContext(AppContext);
  const [isOverride, setIsOverride] = useState<boolean>(
    resource.gitRepositoryOverride
  );

  const { trackEvent } = useTracking();

  const settingsClassName = isOverride
    ? "gitSettingsPanel"
    : "gitSettingsFromProject";

    const [connectResourceToProjectRepository] = useMutation<TData>(CONNECT_RESOURCE_PROJECT_REPO, {
      variables: { resourceId: resource.id }
    });

    const [disconnectGitRepository] = useMutation(DISCONNECT_GIT_REPOSITORY, {
      variables: { resourceId: resource.id }
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
      if(isOverride) {
        handleDisconnectGitRepository()
      }
      else {
        handleConnectProjectGitRepository();
      }
    },
    [handleDisconnectGitRepository,handleConnectProjectGitRepository]); 

  const [updateResourceOverrideStatus] = useMutation<TData>(UPDATE_RESOURCE, {
    onCompleted: (data) => {
      handleResourceStatusChanged(data.updateResource.gitRepositoryOverride); 
    },
  });

  const handleToggleChange = useCallback(
    (gitRepositoryOverride) => {
      trackEvent({
        eventName: "updateResourceInfo",
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

  const isToggleDisable = currentWorkspace?.gitOrganizations?.length === 0;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__panelWarper`}>
        <ProjectConfigurationGitSettings isOverride={isOverride} />
        <Panel
          className={`${CLASS_NAME}__${settingsClassName}`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          <div className={`${CLASS_NAME}__defaultSettings`}>
            <div>Override default settings</div>

            <div>
              <Toggle
                disabled={isToggleDisable}
                onValueChange={handleToggleChange}
                checked = {isOverride}
              />
            </div>
          </div>
          {isOverride && (
            <div className={`${CLASS_NAME}__AuthWithGit`}>
              <hr />
              <AuthResourceWithGit resource={resource} onDone={onDone} />
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default ServiceConfigurationGitSettings;
