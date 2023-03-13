import { Button, EnumButtonStyle, Icon } from "@amplication/design-system";
import React, { useState } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";

const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

const CreateServiceAuth: React.FC<WizardStepProps> = ({ moduleClass }) => {
  const [chooseOption, setChooseOPtion] = useState<string>("Monorepo");

  const handleOptionChoose = (event) => {
    setChooseOPtion(event.target.innerText);
  };

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="One last step - Authentication"
          text={`Choose whether you want to add authentication and authorization layer on your service or not. 
        
        When needed, Amplication will generate your service with guards, decorators, user entity, roles, etc. By default, the service will use “passport-jwt” provider, but you can easily change that later.
        
        You can skip this step if you don’t want to authenticate users on this service. It may be needed for internal services that are not exposed to users, or if you are building a fully public API.
        `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <div className={`${moduleClass}__repo_wrapper`}>
          <div className={`${moduleClass}__db_box`}>
            <div className={`${moduleClass}__db_up_buttons`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleOptionChoose}
              >
                <img
                  className={`${moduleClass}_db_btn`}
                  src={`${PLUGIN_LOGO_BASE_URL}auth-core.png`}
                  alt={""}
                ></img>
              </Button>
              <label>Include Auth Module</label>
              <div className={`${moduleClass}__repository_btn_text`}>
                Generate the code needed for authentication and authorization
              </div>
            </div>
            <div className={`${moduleClass}__db_up_buttons`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={handleOptionChoose}
              >
                <Icon
                  className={`${moduleClass}_db_btn`}
                  icon="unlocked"
                ></Icon>
              </Button>
              <label>Skip Authentication</label>
              <div className={`${moduleClass}__repository_btn_text`}>
                Do not include code for authentication
              </div>
            </div>
          </div>
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceAuth;
