import { CircleBadge, Icon } from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import "./CreateServiceNextSteps.scss";
import { WizardStepProps } from "./interfaces";
import { AppContext } from "../../../context/appContext";
import { useHistory } from "react-router-dom";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

const className = "create-service-next-steps";

export const CreateServiceNextSteps: React.FC<WizardStepProps> = ({
  moduleClass,
  trackWizardPageEvent,
  serviceWizardFlow,
}) => {
  const history = useHistory();
  const {
    currentWorkspace,
    currentProject,
    createServiceWithEntitiesResult: serviceResults,
  } = useContext(AppContext);
  const isOnBoarding = serviceWizardFlow === "Onboarding";

  const handleClickEntities = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Create Entities" }
    );
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${serviceResults?.resource?.id}/entities`
    );
  }, [currentWorkspace, currentProject, serviceResults?.resource]);

  const handleAddPlugins = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Add Plugins" }
    );
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${serviceResults?.resource?.id}/plugins/catalog`
    );
  }, []);

  const handleInviteMyTeams = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Invite Team" }
    );
    history.push(`/${currentWorkspace.id}/members`);
  }, []);

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
        <div
          className={`${className}__link_box`}
          onClick={isOnBoarding ? handleInviteMyTeams : handleAddPlugins}
        >
          <CircleBadge
            color={isOnBoarding ? "#8DD9B9" : "#f85b6e"}
            size="medium"
          >
            <Icon icon={isOnBoarding ? "users" : "plugins"} size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>{isOnBoarding ? "Invite " : "Add plugins"}</div>
            <div>{isOnBoarding ? "my team" : "to my service"}</div>
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
