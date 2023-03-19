import { CircleBadge, Icon } from "@amplication/design-system";
import { useCallback, useContext } from "react";
import "./CreateServiceNextSteps.scss";
import { WizardStepProps } from "./interfaces";
import { AppContext } from "../../../context/appContext";
import { useHistory } from "react-router-dom";

const className = "create-service-next-steps";

export const CreateServiceNextSteps: React.FC<WizardStepProps> = ({
  moduleClass,
}) => {
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const handleClickEntities = useCallback(() => {
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`
    );
  }, [currentWorkspace, currentProject, currentResource]);

  const handleClickCreateNewService = useCallback(() => {
    window.location.reload();
  }, []);

  const handleDone = useCallback(() => {
    history.push(
      `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}`
    );
  }, [currentWorkspace, currentProject, currentResource]);

  return (
    <div className={className}>
      <div className={`${className}__description`}>
        <div className={`${className}__description__top`}>
          Service create successfully.{" "}
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
