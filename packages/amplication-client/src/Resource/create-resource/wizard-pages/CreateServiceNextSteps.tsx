import { CircleBadge, Icon } from "@amplication/design-system";
import "./CreateServiceNextSteps.scss";

export type Props = {
  moduleClass: string;
};

const className = "create-service-next-steps";

export const CreateServiceNextSteps = ({ moduleClass }: Props) => {
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
        <div className={`${className}__link_box`}>
          <CircleBadge color="#53DBEE" size="medium">
            <Icon icon="entity_outline" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>Create entities</div>
            <div>for my service</div>
          </div>
        </div>
        <div className={`${className}__link_box`}>
          <CircleBadge color="#A787FF" size="medium">
            <Icon icon="services" size="small" />
          </CircleBadge>
          <div className={`${className}__link_box__description`}>
            <div>Create</div>
            <div>another service</div>
          </div>
        </div>
        <div className={`${className}__link_box`}>
          <div className={`${className}__link_box__description`}>
            <div>I'm done!</div>
            <div>View my service</div>
          </div>
        </div>
      </div>
    </div>
  );
};
