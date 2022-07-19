import {
  Button,
  CircleBadge,
  EnumButtonStyle,
  EnumIconPosition,
  Icon,
} from "@amplication/design-system";
import React, { useState } from "react";
import "./CreateServiceWizard.scss";
import { CreateServiceWizardForm } from "./CreateServiceWizardForm";

const CLASS_NAME = "create-service-wizard";

const CreateServiceWizard: React.FC<{}> = () => {
  const [clickBtn, setClicked] = useState<boolean>(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__splitWrapper`}>
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
          <CreateServiceWizardForm isClicked={clickBtn} />
        </div>
      </div>
      <div className={`${CLASS_NAME}__footer`}>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          disabled
          icon="arrow_left"
          iconPosition={EnumIconPosition.Left}
        >
          {"Back to project"}
        </Button>
        <Button buttonStyle={EnumButtonStyle.Primary} onClick={handleClick}>
          <label>Create Service</label>
        </Button>
      </div>
    </div>
  );
};

export default CreateServiceWizard;
