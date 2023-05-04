import { Button } from "@amplication/ui/design-system";
import React, { useCallback } from "react";

import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { WizardStepProps } from "../wizard-pages/interfaces";
import "./CreateServiceWelcome.scss";
import { ENTER } from "../../../util/hotkeys";

const className = "create-service-welcome";

const CreateServiceWelcome: React.FC<WizardStepProps> = ({
  goNextPage,
  trackWizardPageEvent,
}) => {
  const handleStart = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Welcome_CTAClick
    );
    goNextPage && goNextPage();
  }, []);

  const handleKeyDownStart = useCallback(
    (keyEvent: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyEvent.key === ENTER) {
        handleStart();
      }
    },
    [goNextPage]
  );

  return (
    <div className={className}>
      <div className={`${className}__welcome`}>
        <h1>
          Welcome to amplication!{" "}
          <span role="img" aria-label="party emoji">
            🎉
          </span>
        </h1>
        <h3>Let's create together your first service</h3>
      </div>
      <div className={`${className}__start_btn`}>
        <Button onKeyDown={handleKeyDownStart} onClick={handleStart}>
          Let's start
        </Button>
      </div>
    </div>
  );
};
CreateServiceWelcome.displayName = "CreateServiceWelcome";

export default CreateServiceWelcome;
