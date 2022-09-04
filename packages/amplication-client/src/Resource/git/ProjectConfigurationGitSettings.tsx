import { EnumPanelStyle, Icon, Panel } from "@amplication/design-system";
import React, { useContext } from "react";
import "./SyncWithGithubPage.scss";
import "./ProjectConfigurationGitSettings.scss";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import GithubSyncDetails from "./GitActions/RepositoryActions/GithubSyncDetails";
import classNames from "classnames";
import { isEmpty } from "lodash";

type Props = {
  isOverride: boolean;
};

const CLASS_NAME = "project-configuration-github-settings";

const ProjectConfigurationGitSettings: React.FC<Props> = ({ isOverride }) => {
  const {
    currentWorkspace,
    currentProject,
    projectConfigurationResource,
  } = useContext(AppContext);

  const gitOrganizations = currentWorkspace?.gitOrganizations;

  const gitStatusPanelClassName = isOverride
    ? "overrideGitStatusPanel"
    : "gitStatusPanel";

  const linkFontClass = isOverride ? "disabled_color" : "inherit_color";

  const projectSettingsLink = () => {
    return (
      <Link
        title={"Go to project settings"}
        to={`/${currentWorkspace?.id}/${currentProject?.id}/${projectConfigurationResource?.id}/github`}
        className={classNames(
          `${CLASS_NAME}__link`,
          `${CLASS_NAME}__${linkFontClass}`
        )}
      >
        Go to project settings
      </Link>
    );
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__settingsLink`}>
        <p className={isOverride ? `${CLASS_NAME}__disabled_color` : ""}>
          These settings are inherited from the project
        </p>
        <p>{projectSettingsLink()}</p>
      </div>
      <Panel
        className={`${CLASS_NAME}__${gitStatusPanelClassName}`}
        panelStyle={EnumPanelStyle.Transparent}
      >
        { projectConfigurationResource?.gitRepository && (
          <GithubSyncDetails
            showGitRepositoryBtn={false}
            className={isOverride ? `${CLASS_NAME}__githubSync` : ""}
            resourceWithRepository={
              projectConfigurationResource
            }
          />
        )}
        {isEmpty(gitOrganizations) && (
          <div className={`${CLASS_NAME}__select-repo`}>
            <Icon icon="info_circle" />
            No organization was selected
          </div>
        )}
        {!isEmpty(gitOrganizations) &&
          isEmpty(projectConfigurationResource?.gitRepository) && (
            <div className={`${CLASS_NAME}__select-repo`}>
              <Icon icon="info_circle" />
              No repository was selected
            </div>
          )}
      </Panel>
    </div>
  );
};

export default ProjectConfigurationGitSettings;
