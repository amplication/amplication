import { EnumPanelStyle, Panel, Toggle } from "@amplication/design-system";
import React, { useContext, useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ProjectConfigurationGitSettings.scss";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import { ResourceWithGitRepository } from "./SyncWithGithubPage";
import AuthResourceWithGit from "./AuthResourceWithGit";
import GithubSyncDetails from "./GitActions/RepositoryActions/GithubSyncDetails";
import classNames from "classnames";

const CLASS_NAME = "project-configuration-github-settings";

type Props = {
  resource: ResourceWithGitRepository;
  onDone: () => void;
};

const ProjectConfigurationGitSettings: React.FC<Props> = (resource, onDone) => {
  const {
    currentWorkspace,
    currentProject,
    projectConfigurationResource,
  } = useContext(AppContext);

  const [isOverride, setIsOverride] = useState<boolean>(false);
  const settingsClassName = isOverride
    ? "gitSettingsPanel"
    : "gitSettingsFromProject";

  const gitStatusPanelClassName = isOverride
    ? "overrideGitStatusPanel"
    : "gitStatusPanel";

    const linkFontClass = isOverride ? "disabled_color" : "inherit_color"; 

  const projectSettingsLink = () => {
    return (
      <Link
        title={"Go to project settings"}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/settings/update`}
        className= { classNames(`${CLASS_NAME}__link`,`${CLASS_NAME}__${linkFontClass}`) }
      >
        Go to project settings
      </Link>
    );
  };

  const handleToggleChange = () => {
    setIsOverride(!isOverride);
  };

  return (
    <div className={`${CLASS_NAME}`}>
      <div className={`${CLASS_NAME}__panelWarper`}>
        <div className={`${CLASS_NAME}__settingsLink`}> 
          <p className= {isOverride ? `${CLASS_NAME}__disabled_color` : ""}>
            These settings are inherited from the project
          </p>
          <p>{projectSettingsLink()}</p>
        </div>
        <Panel
          className={`${CLASS_NAME}__${gitStatusPanelClassName}`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          {projectConfigurationResource?.gitRepository ? (
            <GithubSyncDetails
              showGitRepositoryBtn={false}
              className={isOverride ? `${CLASS_NAME}__githubSync` : ""}
              gitRepositoryWithOrganization={
                projectConfigurationResource.gitRepository
              }
            />
          ) : (
            <div>not connected to git repository</div>
          )}
        </Panel>
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

export default ProjectConfigurationGitSettings;
