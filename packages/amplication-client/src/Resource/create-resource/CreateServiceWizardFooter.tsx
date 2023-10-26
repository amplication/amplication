import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import React, { useContext, useState } from "react";
import "./CreateServiceWizard.scss";
import { AppContext } from "../../context/appContext";
import InnerTabLink from "../../Layout/InnerTabLink";

// eslint-disable-next-line @typescript-eslint/ban-types
const CreateServiceWizardFooter: React.FC<{}> = () => {
  const { currentProject, currentWorkspace } = useContext(AppContext);
  const [continueButtonClicked, setContinueButtonClicked] = useState(false);

  const handleCreateServiceClick = () => {
    if (!continueButtonClicked) {
      setContinueButtonClicked(true);
    }
  };
  return (
    <div className={`create-service-wizard__footer`}>
      <Button
        buttonStyle={EnumButtonStyle.Outline}
        icon="arrow_left"
        iconPosition={EnumIconPosition.Left}
        // onClick={}
      >
        {"Back to project"}
      </Button>
      <InnerTabLink
        to={`/${currentWorkspace?.id}/${currentProject?.id}/create-resource/settings/git-sync`}
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
        onClick={handleCreateServiceClick}
        disabled={continueButtonClicked}
      >
        Continue
      </Button>
    </div>
  );
};

export default CreateServiceWizardFooter;
