import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";

import "./ProjectConfigurationSettingsPage.scss";

const CLASS_NAME = "project-configuration-settings";

const ProjectConfigurationSettingsPage: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } = useContext(
    AppContext
  );

  return (
    <div className={CLASS_NAME}>
      <div>
        <InnerTabLink
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/update`}
          icon="settings"
        >
          General
        </InnerTabLink>
      </div>
      <div>
        <InnerTabLink
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/directories/update`}
          icon="settings"
        >
          Base Directories
        </InnerTabLink>
      </div>
    </div>
  );
};

export default ProjectConfigurationSettingsPage;
