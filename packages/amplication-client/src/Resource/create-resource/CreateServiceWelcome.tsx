import React, { useCallback, useContext, useEffect } from "react";
import "./CreateServiceWelcome.scss";
import { Button, Modal } from "@amplication/ui/design-system";
import { WizardStepProps } from "./wizard-pages/interfaces";
import { AppContext } from "../../context/appContext";
import { useHistory } from "react-router-dom";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { getCookie } from "../../util/cookie";

const CreateServiceWelcome: React.FC<WizardStepProps> = ({ moduleClass }) => {
  const signupCookie = getCookie("signup");
  const defineUser = signupCookie === "1" ? "Onboarding" : "Create Service";
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const { trackEvent } = useTracking();
  const history = useHistory();

  useEffect(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ViewServiceWizardStep_Welcome,
      category: "Service Wizard",
      wizardType: defineUser,
    });
  }, []);

  const handleStart = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ServiceWizardStep_Welcome_CTAClick,
      category: "Service Wizard",
      wizardType: defineUser,
    });
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/create-resource`
    );
  }, [history]);

  return (
    <Modal open fullScreen css={moduleClass}>
      <div className={moduleClass}>
        <h2>
          Welcome to amplication!{" "}
          <span role="img" aria-label="party emoji">
            🎉
          </span>
        </h2>
        <h3>Let’s create together your first service</h3>
        <div className={`${moduleClass}__start_btn`}>
          <Button onClick={handleStart}>Let's start</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateServiceWelcome;
