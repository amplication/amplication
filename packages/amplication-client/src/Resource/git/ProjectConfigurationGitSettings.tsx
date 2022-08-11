import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import React, { useContext, useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ProjectConfigurationGitSettings.scss";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import AppGitStatusPanel from "./AppGitStatusPanel";
import { ResourceWithGitRepository } from "./SyncWithGithubPage";
import AuthResourceWithGit from "./AuthResourceWithGit";

const CLASS_NAME = "project-configuration-github-settings";

type Props = {
  resource: ResourceWithGitRepository;
  onDone: () => void;
};

const ProjectConfigurationGitSettings: React.FC<Props> = (resource, onDone) => {
  const {
    currentWorkspace,
    currentProject,
    //currentResource,
    projectConfigurationResource,
  } = useContext(AppContext);

  const [isOverride, setIsOverride] = useState<boolean>(false);
  const settingsClassName = isOverride
    ? "gitSettingsPanel"
    : "gitSettingsFromProject";

  const projectSettingsLink = () => {
    return (
      <Link
        title={"Go to project settings"}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/settings/update`}
        className={`${CLASS_NAME}__link`}
      >
        Go to project settings
      </Link>
    );
  };

  const handleToggleChange = () => {
    setIsOverride(!isOverride);
  };

  return (
    <div>
      <div className={`${CLASS_NAME}__settingsLink`}>
        <p>
          These settings are inherited from the project
          {projectSettingsLink()}
        </p>
      </div>
      <Panel
        panelStyle={EnumPanelStyle.Bordered}
        className={`${CLASS_NAME}__gitStatusPanel`}
      >
        <AppGitStatusPanel
          resource={projectConfigurationResource}
          showDisconnectedMessage
        />
      </Panel>
      <div className={`${CLASS_NAME}__${settingsClassName}`}>
        <div className={`${CLASS_NAME}__defaultSettings`}>
          <label>Override default settings</label>
          <Toggle
            className={`${CLASS_NAME}__defaultSettings__toggle`}
            onChange={handleToggleChange}
          />
          {isOverride && <hr />}
        </div>
        {isOverride && (
          <AuthResourceWithGit resource={resource.resource} onDone={onDone} />
        )}
      </div>
    </div>
  );
};

export default ProjectConfigurationGitSettings;
