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

  const handleClickCreateNewService = useCallback(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ServiceWizardStep_Finish_CTAClicked,
      { action: "Create Another Service" }
    );
    window.location.reload();
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
          onClick={handleClickCreateNewService}
        >
          <CircleBadge color="#A787FF" size="medium">
            <Icon icon="services" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>Create</div>
            <div>another service</div>
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
