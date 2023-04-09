import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback } from "react";
import CodeGenerationCompleted from "../../../assets/images/code-generation-completed.svg";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import "../CreateServiceWizard.scss";
import { className } from "./CreateServiceCodeGeneration";
import "./CreateServiceCodeGeneration.scss";
import { WizardStepProps } from "./interfaces";

const BuildCompletedScreen: React.FC<
  WizardStepProps & { pullRequestLink: string }
> = ({ trackWizardPageEvent, pullRequestLink }) => {
  const handleViewCodeClick = useCallback(() => {
    trackWizardPageEvent(AnalyticsEventNames.ServiceWizardStep_ViewCodeClicked);
  }, [trackWizardPageEvent]);

  return (
    <div className={`${className}__status`}>
      <div className={`${className}__status__completed`}>
        <img
          className={`${className}__status__completed__image`}
          src={CodeGenerationCompleted}
          alt=""
        />

        <div className={`${className}__status__completed__description`}>
          <div
            className={`${className}__status__completed__description__header`}
          >
            The code for your service is ready on
          </div>
          <a href={pullRequestLink}>
            <div
              className={`${className}__status__completed__description__link`}
            >
              {pullRequestLink}
            </div>
          </a>
          <div />
        </div>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          onClick={handleViewCodeClick}
        >
          {
            <a style={{ color: "white" }} href={pullRequestLink} target="docs">
              View my code
            </a>
          }
        </Button>
      </div>
    </div>
  );
};

export default BuildCompletedScreen;
