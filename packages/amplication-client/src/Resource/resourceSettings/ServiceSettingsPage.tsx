import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";
import "./ServiceSettingsPage.scss";

const CLASS_NAME = "service-settings";

// eslint-disable-next-line @typescript-eslint/ban-types
const ServiceSettingsPage: React.FC<{}> = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

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
          Base Directory
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
