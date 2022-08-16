import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import React, { useContext, useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ServiceConfigurationGitSettings.scss";
import { ResourceWithGitRepository } from "./SyncWithGithubPage";
import AuthResourceWithGit from "./AuthResourceWithGit";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import { AppContext } from "../../context/appContext";

const CLASS_NAME = "service-configuration-github-settings";

type Props = {
  resource: ResourceWithGitRepository;
  onDone: () => void;
};

const ServiceConfigurationGitSettings: React.FC<Props> = (resource, onDone) => {
  const { currentWorkspace } = useContext(AppContext);
  const [isOverride, setIsOverride] = useState<boolean>(false); //get from AppContext and update when status changed
  const settingsClassName = isOverride
    ? "gitSettingsPanel"
    : "gitSettingsFromProject";

  const handleToggleChange = () => {
    setIsOverride(!isOverride);
  };

  const isToggleDisable = currentWorkspace?.gitOrganizations?.length === 0;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__panelWarper`}>
        <ProjectConfigurationGitSettings />
        <Panel
          className={`${CLASS_NAME}__${settingsClassName}`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          <div className={`${CLASS_NAME}__defaultSettings`}>
            <div>Override default settings</div>

            <div>
              <Toggle
                disabled={isToggleDisable}
                onChange={handleToggleChange}
              />
            </div>
          </div>
          {isOverride && (
            <div className={`${CLASS_NAME}__AuthWithGit`}>
              <hr />
              <AuthResourceWithGit
                resource={resource.resource}
                onDone={onDone}
              />
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default ServiceConfigurationGitSettings;
