import { Icon, Text } from "@amplication/ui/design-system";
import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import "./ModuleActionsFreePlan.scss";
import ModuleActionsFreePlanImg from "../assets/images/module-actions-free-plan.svg";
type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module?: string;
  }>;
};

const CLASS_NAME = "module-actions-free-plan";
const ModuleActionsFreePlan = React.memo(({ match }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__feature`}>
        <span>Premium feature</span>
        <Icon icon={"dimond"} size={"xsmall"} />
      </div>

      <h3 className={`${CLASS_NAME}__title`}>
        Unlock your APIs Full Potential
      </h3>
      <div className={`${CLASS_NAME}__description`}>
        <p>
          Maximize the power of your APIs and Types through seamless management
          and customization as a unified source of truth.
        </p>
        <a
          className={`${CLASS_NAME}__contact-us`}
          href={"https://meetings-eu1.hubspot.com/liza-dymava/cta-link"}
          target="blank"
        >
          <Text>{"Contact us for more information"}</Text>
        </a>
      </div>
      <img
        className={`${CLASS_NAME}__image`}
        src={ModuleActionsFreePlanImg}
        alt=""
      ></img>
    </div>
  );
});

export default ModuleActionsFreePlan;
