import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";

const ServiceSettingsPage: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } = useContext(
    AppContext
  );

  return (
    <div>
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
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/generationSettings/update`}
          icon="settings"
        >
          APIs & Admin UI
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
      <div>
        <InnerTabLink
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/db/update`}
          icon="settings"
        >
          Database
        </InnerTabLink>
      </div>
      <div>
        <InnerTabLink
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/auth/update`}
          icon="settings"
        >
          Authentication
        </InnerTabLink>
      </div>
      <div>
        <InnerTabLink
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/settings/api-tokens`}
          icon="id"
        >
          API Tokens
        </InnerTabLink>
      </div>
    </div>
  );
};

export default ServiceSettingsPage;
