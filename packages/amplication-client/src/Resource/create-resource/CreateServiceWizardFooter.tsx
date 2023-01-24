import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/design-system";
import React, { useContext } from "react";
import "./CreateServiceWizard.scss";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";

// eslint-disable-next-line @typescript-eslint/ban-types
const CreateServiceWizardFooter: React.FC<{}> = () => {
  const { currentProject, currentWorkspace } = useContext(AppContext);

  return (
    <div className={`create-service-wizard__footer`}>
      <Button
        buttonStyle={EnumButtonStyle.Secondary}
        icon="arrow_left"
        iconPosition={EnumIconPosition.Left}
        // onClick={}
      >
        {"Back to project"}
      </Button>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/create-resource/details/service-name`}
        icon="settings"
      >
        General
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
      </InnerTabLink>
      <Button
        buttonStyle={EnumButtonStyle.Primary}
        //onClick={handleCreateServiceClick}
      >
        <label>Continue</label>
      </Button>
    </div>
  );
};

export default CreateServiceWizardFooter;
