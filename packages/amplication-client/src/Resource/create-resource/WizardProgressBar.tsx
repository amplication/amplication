import React, { useContext } from "react";
import "./CreateServiceWizard.scss";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";

const WizardProgressBar: React.FC = () => {
  const { currentProject, currentWorkspace } = useContext(AppContext);

  return (
    <div>
      {/* <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/create-resource/details/service-name`}
        icon="settings"
      >
        Create service
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/create-resource/settings/github-sync`}
        icon="settings"
      >
        Settings
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/create-resource/settings/generation-settings`}
        icon="settings"
      >
        Settings
      </InnerTabLink>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/create-resource/settings/repository`}
        icon="settings"
      >
        Repository
      </InnerTabLink> */}
    </div>
  );
};

export default WizardProgressBar;
