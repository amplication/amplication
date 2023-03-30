import React, { useCallback, useEffect } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

import jwt from "../../../assets/images/jwt.svg";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

const CreateServiceAuth: React.FC<WizardStepProps> = ({
  formik,
  trackWizardPageEvent,
}) => {
  useEffect(() => {
    trackWizardPageEvent(
      AnalyticsEventNames.ViewServiceWizardStep_AuthSettings
    );
  }, []);

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
          header="Does your service need Authentication?"
          text={`Choose whether or not to enable authentication and authorization for  your service.`}
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
