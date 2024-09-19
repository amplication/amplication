import {
  CircleBadge,
  EnumTextColor,
  Icon,
} from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import "./CreateServiceNextSteps.scss";
import { WizardStepProps } from "./interfaces";
import { AppContext } from "../../../context/appContext";
import { useHistory } from "react-router-dom";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { useProjectBaseUrl } from "../../../util/useProjectBaseUrl";
import { WizardFlowType } from "../types";

const className = "create-service-next-steps";

export const CreateServiceNextSteps: React.FC<
  WizardStepProps & {
    wizardFlowType: WizardFlowType;
  }
> = ({ moduleClass, trackWizardPageEvent, flowSettings, wizardFlowType }) => {
  const history = useHistory();
  const { createServiceWithEntitiesResult: serviceResults } =
    useContext(AppContext);

  const { baseUrl } = useProjectBaseUrl();

  const handleClickEntities = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Create Entities" }
    );
    history.push(`${baseUrl}/${serviceResults?.resource?.id}/entities`);
  }, [baseUrl, history, serviceResults?.resource?.id, trackWizardPageEvent]);

  const handleClickRoute = useCallback(() => {
    const routeUrl = `${baseUrl}/${serviceResults?.resource?.id}/plugins/catalog`;

    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Add Plugins" }
    );
    history.push(routeUrl);
  }, [baseUrl, serviceResults?.resource?.id, trackWizardPageEvent, history]);

  const handleDone = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "View Service" }
    );
    if (wizardFlowType === "Create Service Template") {
      history.push(`${baseUrl}`);
    } else {
      history.push(`${baseUrl}/${serviceResults?.resource?.id}`);
    }
  }, [
    baseUrl,
    history,
    serviceResults?.resource?.id,
    trackWizardPageEvent,
    wizardFlowType,
  ]);

  return (
    <div className={className}>
      <div className={`${className}__description`}>
        <div className={`${className}__description__top`}>
          {flowSettings.texts?.successTitle || (
            <>
              Service created successfully.{" "}
              <span role="img" aria-label="party emoji">
                🎉
              </span>
            </>
          )}
        </div>
        <div className={`${className}__description__bottom`}>
          What should we do next?
        </div>
      </div>
      <div className={`${className}__link_box_container`}>
        <div className={`${className}__link_box`} onClick={handleClickEntities}>
          <CircleBadge themeColor={EnumTextColor.ThemeTurquoise} size="medium">
            <Icon icon="entity_outline" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>
              {flowSettings.texts?.successEntitiesLine1 || "Create entities"}
            </div>
            <div>
              {flowSettings.texts?.successEntitiesLine2 || "for my service"}
            </div>
            <div></div>
          </div>
        </div>
        <div className={`${className}__link_box`} onClick={handleClickRoute}>
          <CircleBadge themeColor={EnumTextColor.ThemeOrange} size="medium">
            <Icon icon="plugins" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>
              {flowSettings.texts?.successPluginsLine1 || "Add Plugins"}
            </div>
            <div>
              {flowSettings.texts?.successPluginsLine2 || "to my service"}
            </div>
            <div></div>
          </div>
        </div>
        <div className={`${className}__link_box`} onClick={handleDone}>
          <CircleBadge themeColor={EnumTextColor.ThemeGreen} size="medium">
            <Icon icon="check" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>{flowSettings.texts?.successDoneLine1 || "I'm done!"}</div>
            <div>
              {flowSettings.texts?.successDoneLine2 || "View my service"}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};
