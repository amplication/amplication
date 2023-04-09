import { Button } from "@amplication/ui/design-system";
import React, { useCallback, useEffect } from "react";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { WizardStepProps } from "../wizard-pages/interfaces";
import "./CreateServiceWelcome.scss";

const className = "create-service-welcome";

const CreateServiceWelcome: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
  goNextPage,
  trackWizardPageEvent,
}) => {
  useEffect(() => {
    trackWizardPageEvent(AnalyticsEventNames.ViewServiceWizardStep_Welcome);
    formik.validateForm();
  }, []);

  const handleStart = useCallback(() => {
    goNextPage && goNextPage();
  }, []);

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
        <Button onClick={handleStart}>Let's start</Button>
      </div>
    </div>
  );
};
CreateServiceWelcome.displayName = "CreateServiceWelcome";

export default CreateServiceWelcome;
