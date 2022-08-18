import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import React, { useCallback, useContext, useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ServiceConfigurationGitSettings.scss";
import { ResourceWithGitRepository } from "./SyncWithGithubPage";
import AuthResourceWithGit from "./AuthResourceWithGit";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import { AppContext } from "../../context/appContext";
import { useMutation } from "@apollo/client";
import { UPDATE_RESOURCE } from "../ResourceForm";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";

const CLASS_NAME = "service-configuration-github-settings";

type Props = {
  resource: ResourceWithGitRepository;
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

  const [updateResourceOverrideStatus] = useMutation<TData>(UPDATE_RESOURCE, {
    onCompleted: (data) => {
      setIsOverride(data.updateResource.gitRepositoryOverride);
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
