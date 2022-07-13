import { CircleBadge, Icon } from "@amplication/design-system";
import React from "react";
import "./CreateServiceWizard.scss";
import { CreateServiceWizardForm } from "./CreateServiceWizardForm";

const CLASS_NAME = "create-service-wizard";

export const CreateServiceWizard = () => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__left`}>
        <div className={`${CLASS_NAME}__description`}>
          <CircleBadge name={""} size="size40" color="#A787FF">
            <Icon icon="services" size="medium" />
          </CircleBadge>

          <h2>Lorem ipsum dolor sit amet</h2>
          <h3>
            Your Amplication-generated app is ready. We created it using the
            amazing open-source technologies.
          </h3>
        </div>
      </div>
      <div className={`${CLASS_NAME}__right`}>
        <CreateServiceWizardForm />
      </div>
    </div>
  );
};
