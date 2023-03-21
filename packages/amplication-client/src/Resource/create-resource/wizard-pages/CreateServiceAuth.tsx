import React, { useCallback } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

import jwt from "../../../assets/images/jwt.svg";

const CreateServiceAuth: React.FC<WizardStepProps> = ({ formik }) => {
  const handleDatabaseSelect = useCallback(
    (database: string) => {
      formik.setValues(
        {
          ...formik.values,
          authType: database,
        },
        true
      );
    },
    [formik.values]
  );

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
          <LabelDescriptionSelector
            name="core"
            image={jwt}
            label="Include Auth Module"
            description="Generate the code needed for authentication and authorization"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.authType}
          />
          <LabelDescriptionSelector
            name="no"
            icon="unlock"
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
