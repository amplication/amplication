import { Button, EnumButtonStyle, Icon } from "@amplication/design-system";
import React, { useCallback } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { ImageLabelDescriptionSelector } from "./ImageLabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

const CreateServiceAuth: React.FC<WizardStepProps> = ({
  formik,
  moduleClass,
}) => {
  const handleDatabaseSelect = useCallback((database: string) => {
    formik.handleChange({ target: { name: "authType", value: database } });
  }, []);

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
        <Layout.SelectorWrapper>
          <ImageLabelDescriptionSelector
            name="core"
            icon={`${PLUGIN_LOGO_BASE_URL}auth-core.png`}
            label="Include Auth Module"
            description="Generate the code needed for authentication and authorization"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.authType}
          />
          <ImageLabelDescriptionSelector
            name="no"
            icon={`${PLUGIN_LOGO_BASE_URL}auth-core.png`}
            label="Skip Authentication"
            description="Do not include code for authentication"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.authType}
          />
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceAuth;
