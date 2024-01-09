import { CircleBadge, Icon } from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import "./CreateServiceNextSteps.scss";
import { WizardStepProps } from "./interfaces";
import { AppContext } from "../../../context/appContext";
import { useHistory } from "react-router-dom";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { DefineUser } from "../CreateServiceWizard";

const className = "create-service-next-steps";

export const CreateServiceNextSteps: React.FC<
  WizardStepProps & {
    defineUser: DefineUser;
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
  const {
    currentWorkspace,
    currentProject,
    createServiceWithEntitiesResult: serviceResults,
  } = useContext(AppContext);

  const handleClickEntities = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Create Entities" }
    );
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${serviceResults?.resource?.id}/entities`
    );
  }, [currentWorkspace, currentProject, serviceResults?.resource]);

  const handleClickRoute = useCallback(() => {
    const routeUrl =
      defineUser === "Onboarding"
        ? `/${currentWorkspace.id}/members`
        : `/${currentWorkspace.id}/${currentProject.id}/${serviceResults?.resource?.id}/plugins/catalog`;

    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: eventActionName }
    );
    history.push(routeUrl);
  }, [currentWorkspace.id, currentProject.id, serviceResults?.resource?.id]);

  const handleDone = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "View Service" }
    );
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${serviceResults?.resource?.id}`
    );
  }, [currentWorkspace, currentProject, serviceResults?.resource]);

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
