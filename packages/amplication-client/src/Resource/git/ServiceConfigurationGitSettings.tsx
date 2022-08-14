import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import React, { useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ServiceConfigurationGitSettings.scss";
import { ResourceWithGitRepository } from "./SyncWithGithubPage";
import AuthResourceWithGit from "./AuthResourceWithGit";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";

const CLASS_NAME = "service-configuration-github-settings";

type Props = {
  resource: ResourceWithGitRepository;
  onDone: () => void;
};

const ServiceConfigurationGitSettings: React.FC<Props> = (resource, onDone) => {

  const [isOverride, setIsOverride] = useState<boolean>(false); //get from AppContext and update when status changed 
  const settingsClassName = isOverride
    ? "gitSettingsPanel"
    : "gitSettingsFromProject";


  const handleToggleChange = () => {
    setIsOverride(!isOverride);
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__panelWarper`}>
          <ProjectConfigurationGitSettings />
        <Panel
          className={`${CLASS_NAME}__${settingsClassName}`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          <div className={`${CLASS_NAME}__defaultSettings`}>
            <label>Override default settings</label>
            <Toggle
              className={`${CLASS_NAME}__toggle`}
              onChange={handleToggleChange}
            />
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
