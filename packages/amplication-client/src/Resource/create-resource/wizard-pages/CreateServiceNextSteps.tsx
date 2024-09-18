import { CircleBadge, Icon } from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import "./CreateServiceNextSteps.scss";
import { WizardStepProps } from "./interfaces";
import { AppContext } from "../../../context/appContext";
import { useHistory } from "react-router-dom";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { WizardFlowType } from "../CreateServiceWizard";
import { useProjectBaseUrl } from "../../../util/useProjectBaseUrl";

const className = "create-service-next-steps";

export const CreateServiceNextSteps: React.FC<
  WizardStepProps & {
    defineUser: WizardFlowType;
    description: string[];
    icon: string;
    iconBackgroundColor: string;
    eventActionName: string;
  }
> = ({
  moduleClass,
  trackWizardPageEvent,
  description,
  defineUser,
  icon,
  iconBackgroundColor,
  eventActionName,
}) => {
  const history = useHistory();
  const { currentWorkspace, createServiceWithEntitiesResult: serviceResults } =
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
    const routeUrl =
      defineUser === "Onboarding"
        ? `/${currentWorkspace.id}/members`
        : `${baseUrl}/${serviceResults?.resource?.id}/plugins/catalog`;

    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: eventActionName }
    );
    history.push(routeUrl);
  }, [
    defineUser,
    currentWorkspace?.id,
    baseUrl,
    serviceResults?.resource?.id,
    trackWizardPageEvent,
    eventActionName,
    history,
  ]);

  const handleDone = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "View Service" }
    );
    history.push(`${baseUrl}/${serviceResults?.resource?.id}`);
  }, [baseUrl, history, serviceResults?.resource?.id, trackWizardPageEvent]);

  return (
    <div className={className}>
      <div className={`${className}__description`}>
        <div className={`${className}__description__top`}>
          Service created successfully.{" "}
          <span role="img" aria-label="party emoji">
            🎉
          </span>
        </div>
        <div className={`${className}__description__bottom`}>
          What should we do next?
        </div>
      </div>
      <div className={`${className}__link_box_container`}>
        <div className={`${className}__link_box`} onClick={handleClickEntities}>
          <CircleBadge color="#53DBEE" size="medium">
            <Icon icon="entity_outline" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>Create entities</div>
            <div>for my service</div>
          </div>
        </div>
        <div className={`${className}__link_box`} onClick={handleClickRoute}>
          <CircleBadge color={iconBackgroundColor} size="medium">
            <Icon icon={icon} size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            {description.map((c) => (
              <div>{c}</div>
            ))}
          </div>
        </div>
        <div className={`${className}__link_box`} onClick={handleDone}>
          <div className={`${className}__link_box__description`}>
            <div>I'm done!</div>
            <div>View my service</div>
          </div>
        </div>
      </div>
    </div>
  );
};
